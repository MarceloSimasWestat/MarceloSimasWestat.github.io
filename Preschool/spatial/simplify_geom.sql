/*
Original source: https://trac.osgeo.org/postgis/wiki/UsersWikiSimplifyPreserveTopology
[SIC]
-- Simplify the given table of multipolygon with the given tolerance.
-- This function preserves the connection between polygons and try to avoid generating gaps between objects.
-- To identify objects after simplification, area comparison is performed, instead of PIP test, that may fail
-- with odd-shaped polygons. Area comparison may also failed on some cases
*/

CREATE or replace function simplify_geom(
	_table_schema text,
	_table_name text,
	_id_column text,
	_geom_column text,
	_tolerance float,
	_stash_unioned BOOLEAN, /* This stash and the following load  parameter may be worth it for very large geometry sets because of the processing bottleneck of st_union.  */
	_load_stash_unioned BOOLEAN) /* Set _stash_union to TRUE in first call for given geometry, and _load_stash_unioned to TRUE for subsequent calls. Your subsequent calls will be magnitudes faster. */
returns setof record as $$

DECLARE

	_the_source_table text := '';
	_temp_table_salt TEXT := SUBSTRING(random()::TEXT FROM 3 FOR 4);
	
BEGIN

IF _table_schema IS NULL OR length(_table_schema) = 0 THEN
		_the_source_table := quote_ident(_table_name);
ELSE
		_the_source_table := quote_ident(_table_schema) || '.' || quote_ident(_table_name);
END IF;

raise NOTICE 'Simplifying geometry field % in table %. Time: %', _geom_column, _the_source_table, to_char(clock_timestamp(), 'HH24:MI:ss');

EXECUTE
	'CREATE UNLOGGED TABLE poly' || _temp_table_salt || ' AS (' ||
		'SELECT '  || quote_ident(_id_column) || ', (st_dump(' || quote_ident(_geom_column) || ')).* 
		 FROM '  || _the_source_table ||  ')';

EXECUTE
	'CREATE INDEX poly_geom_idx' ||  _temp_table_salt || ' ON poly' || _temp_table_salt || ' USING gist(geom)';

EXECUTE
	'CREATE UNLOGGED TABLE rings' || _temp_table_salt || ' AS
	SELECT st_exteriorRing((st_dumpRings(geom)).geom) as g
	FROM poly' || _temp_table_salt;

EXECUTE
	'CREATE INDEX rings_g_idx' || _temp_table_salt || ' ON rings' || _temp_table_salt || ' USING gist(g)';

EXECUTE
	'DROP TABLE poly' || _temp_table_salt;

raise NOTICE 'st_exteriorRing, st_dumpRings done. Time: %', to_char(clock_timestamp(), 'HH24:MI:ss');

IF _load_stash_unioned = TRUE THEN

	raise NOTICE 'ST_Union process being loaded from stashed table %_st_union_stash. Time: %', _the_source_table, to_char(clock_timestamp(), 'HH24:MI:ss');

	EXECUTE
		'CREATE UNLOGGED TABLE gunion' || _temp_table_salt || ' AS
		SELECT * FROM ' || _the_source_table || '_st_union_stash';

ELSE

	EXECUTE
		'CREATE UNLOGGED TABLE gunion' || _temp_table_salt || ' AS
		SELECT st_union(g) AS g
		FROM rings' || _temp_table_salt;

END IF;

EXECUTE
	'CREATE INDEX gunion_g_idx' || _temp_table_salt || ' ON gunion' || _temp_table_salt || ' USING gist(g)';

EXECUTE
	'DROP TABLE rings' || _temp_table_salt;

raise NOTICE 'ST_Union done. Time: %', to_char(clock_timestamp(), 'HH24:MI:ss');

EXECUTE
	'CREATE UNLOGGED TABLE mergedrings' || _temp_table_salt || ' AS
	SELECT st_linemerge(g) AS g
	FROM gunion' || _temp_table_salt;

raise NOTICE 'st_linemerge done. Time: %', to_char(clock_timestamp(), 'HH24:MI:ss');

IF _stash_unioned = TRUE THEN

	EXECUTE
		'CREATE TABLE ' || _the_source_table || '_st_union_stash AS
		SELECT * FROM gunion' || _temp_table_salt;

	EXECUTE
		'CREATE INDEX gunion_st_union_stash_idx' || _temp_table_salt || ' ON ' || _the_source_table || '_st_union_stash USING gist(g)';

	raise NOTICE 'ST_Union process output stashed in table %_st_union_stash. Time: %', _the_source_table, to_char(clock_timestamp(), 'HH24:MI:ss');

END IF;

EXECUTE
	'DROP TABLE gunion' || _temp_table_salt;

EXECUTE
	'CREATE UNLOGGED TABLE simplerings' || _temp_table_salt || ' AS
	SELECT st_simplifyPreserveTopology(g, ' || _tolerance || ') as g
	FROM mergedrings' || _temp_table_salt;

raise NOTICE 'st_simplifyPreserveTopology done: %', to_char(clock_timestamp(), 'HH24:MI:ss');

EXECUTE
	'DROP TABLE mergedrings' || _temp_table_salt;

EXECUTE
	'CREATE UNLOGGED TABLE simplelines' || _temp_table_salt || ' AS
	SELECT (st_dump(g)).geom AS g
	FROM simplerings' || _temp_table_salt;

EXECUTE
	'DROP TABLE simplerings' || _temp_table_salt;

EXECUTE
	'CREATE  TABLE simplepolys' || _temp_table_salt || ' AS
	SELECT (st_dump(st_polygonize(distinct g))).geom AS g
	FROM simplelines' || _temp_table_salt;

raise NOTICE 'ST_Dump with ST_Polygonize done. Time: %', to_char(clock_timestamp(), 'HH24:MI:ss');

EXECUTE
	'DROP TABLE simplelines' || _temp_table_salt;

EXECUTE
	'CREATE INDEX simplepolys_geom_gist' || _temp_table_salt || ' ON simplepolys' || _temp_table_salt || ' USING gist(g)';

/*
[SIC]
works better: comparing percentage of overlaping area gives better results.
as input set is multipolygon, we first explode multipolygons INTO their polygons, to
be able to find islands and set them the right departement code.
*/
RETURN QUERY EXECUTE
	'SELECT ' || quote_ident(_id_column) || ', st_collect(st_makevalid(' || quote_ident(_geom_column) || ')) AS geom '
	 ||  'FROM ('
	-- || '    SELECT distinct on (d.' || quote_ident(_id_column) || ') d.' || quote_ident(_id_column) || ', s.g as geom '
	 || '	SELECT d.' ||  quote_ident(_id_column)  || ', s.g as geom '
	 || '	FROM ' ||  _the_source_table  || ' AS d, simplepolys' || _temp_table_salt || ' AS s '
	-- || '    where (st_intersects(d.' || quote_ident(_geom_column) || ', s.g) or st_contains(d.' || quote_ident(_geom_column) || ', s.g))'
	 || '	WHERE st_intersects(d.' || quote_ident(_geom_column) || ', s.g) '
	 || '		AND st_area(st_intersection(ST_MakeValid(s.g), ST_MakeValid(d.' || quote_ident(_geom_column) || ')))/st_area(ST_MakeValid(s.g)) > 0.5 ' /* ST_MakeValid littered throughout because of a very occasional error "Error performing intersection: TopologyException: Input geom 1 is invalid: Ring Self-intersection at or near point" */
	 || ') as foo '
	 || 'GROUP BY ' || quote_ident(_id_column);

EXECUTE
	'DROP TABLE simplepolys' || _temp_table_salt;

RETURN;

END;
$$ language plpgsql strict;
DROP FUNCTION simplify_coast(_state_fips TEXT);
CREATE FUNCTION simplify_coast(_state_fips TEXT) RETURNS void AS
$BODY$
DECLARE

BEGIN

/* don't have to do it this way, but it gives us an intuitive/reasonable geography to then subset by */
CREATE TEMP TABLE entire_state_stash AS
SELECT statefp, leaid, m.geom --statefp, m.geom AS geom
FROM schooldistricts_medium AS m
INNER JOIN schooldistricts USING (gid)
WHERE statefp = _state_fips;
CREATE INDEX entire_state_stash_idx ON entire_state_stash USING gist(geom);

CREATE TEMP TABLE new_state AS
SELECT leaid,
	ST_Difference(
		ST_makevalid(geom),
		(
			SELECT DISTINCT ST_Union(ST_Multi(ST_Difference(entire_state_stash.geom, cutter.geom))) AS geom
			FROM entire_state_stash, (SELECT ST_Collect(usa_48_5m.geom) geom FROM usa_48_5m) cutter
		)
	)
 AS geom
FROM entire_state_stash;
begin;
UPDATE schooldistricts_medium
SET geom = updated.geom
FROM schooldistricts,
(
	SELECT new.leaid, new.geom
	FROM new_state AS new  
	LEFT JOIN entire_state_stash AS old ON old.leaid = new.leaid AND old.geom = new.geom
	WHERE old.geom IS NULL
)	AS updated
WHERE schooldistricts.gid = schooldistricts_medium.gid AND schooldistricts.leaid = updated.leaid

END;
$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;

/*
CREATE TABLE schooldistricts_medium_stash AS SELECT * FROM schooldistricts_medium;
COMMENT ON TABLE schooldistricts_medium_stash IS 'stashing simplified school district geom table (historically called ''medium'') prior to running coastal water simplification'
*/
SELECT string_agg(quote_literal(statefp),',' ORDER BY quote_literal(statefp)) FROM regions WHERE statefp IN ('01','02','04','05','06','08','09','10','11','12','13','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','44','45','46','47','48','49','50','51','53','54','55','56');

SELECT string_agg(quote_literal(statefp),',' ORDER BY quote_literal(statefp)) FROM regions WHERE region IN (1);

SELECT COUNT(*) FROM regions WHERE statefp IN ('01','02','04','05','06','08','09','10','11','12','13','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','44','45','46','47','48','49','50','51','53','54','55','56');

SELECT
	'CREATE TABLE schooldistricts_lowest AS (
	' || RIGHT(string_agg('UNION SELECT * FROM ' || table_name, ' '), - 6) || ');
	ALTER TABLE schooldistricts_lowest ADD PRIMARY KEY (gid);'
FROM information_schema.tables
WHERE table_name ILIKE '%lowest';

SELECT
	'CREATE TABLE schooldistricts_lower AS (
	' || RIGHT(string_agg('UNION SELECT * FROM ' || table_name, ' '), - 6) || ');
	ALTER TABLE schooldistricts_lower ADD PRIMARY KEY (gid);'
FROM information_schema.tables
WHERE table_name ILIKE '%lower';

SELECT
	'CREATE TABLE schooldistricts_low AS (
	' || RIGHT(string_agg('UNION SELECT * FROM ' || table_name, ' '), - 6) || ');
	ALTER TABLE schooldistricts_low ADD PRIMARY KEY (gid);'
FROM information_schema.tables
WHERE table_name ILIKE '%low';

SELECT
	'CREATE TABLE schooldistricts_medium AS (
	' || RIGHT(string_agg('UNION SELECT * FROM ' || table_name, ' '), - 6) || ');
	ALTER TABLE schooldistricts_medium ADD PRIMARY KEY (gid);'
FROM information_schema.tables
WHERE table_name ILIKE '%medium';

SELECT
	'CREATE TABLE schooldistricts_highest AS (
	' || RIGHT(string_agg('UNION SELECT * FROM ' || table_name, ' '), - 6) || ');
	ALTER TABLE schooldistricts_highest ADD PRIMARY KEY (gid);'
FROM information_schema.tables
WHERE table_name ILIKE '%highest';
-- DELETE FROM schooldistricts_highest
-- WHERE st_area(geom::geography) * 0.000000386102 < 6;


SELECT 'DROP TABLE ' || table_name || ' ;' FROM information_schema.tables WHERE table_name ILIKE '%_medium%';
SELECT 'ALTER TABLE ' || table_name || ' RENAME TO ' || table_name || '_2013;' FROM information_schema.tables WHERE table_name ILIKE '%_st_union_stash%';

SELECT * FROM regions ORDER BY region, statefp;


SELECT table_name FROM information_schema.tables WHERE table_name ILIKE '%_st_union_stash';

SELECT column_name FROM information_schema.columns WHERE table_name = 'schooldistricts' ORDER BY 1;
SELECT column_name FROM information_schema.columns WHERE table_name = 'schooldistricts_2013' ORDER BY 1;

SELECT sum(ST_NPoints(geom)) FROM schooldistricts_medium_with_features_b;
SELECT sum(ST_NPoints(ST_SimplifyPreserveTopology(geom,0.0001))) FROM schooldistricts_medium_with_features_b;
SELECT gid, st_union FROM schooldistricts_medium_with_features_b;

UPDATE schooldistricts_medium_with_features_b
SET geom = ST_SimplifyPreserveTopology(geom,0.0001);

UPDATE schooldistricts_medium_with_features_b
SET geom = foo.geom
FROM (SELECT gid, ST_Union(geom) AS geom FROM schooldistricts_medium_with_features_b GROUP BY gid) foo
WHERE schooldistricts_medium_with_features_b.gid = foo.gid

GROUP BY a.gid, regions."name", schooldistricts."name", COALESCE(coos_pct.label, 'Null or missing data'), oos_tot::INT, round(oos_pct::NUMERIC * 100, 2)::TEXT || '%', oos_data.enr_tot::INT;

SELECT * FROM schooldistricts WHERE "name" ILIKE '%perris%';


SELECT ST_GeomFromText(pt_geom) AS geometry, pt_geom, count(*) AS cnt
FROM
 (SELECT gid,ST_AsText(ST_PointN(geom, generate_series(1, ST_NPoints(geom) -1))) AS pt_geom
  FROM
   (SELECT gid, (ST_Dump(ST_Boundary(geom))).geom
    FROM schooldistricts
    WHERE mtfcc IN ('G5410')
    ) AS linestrings
  ) AS points
GROUP BY pt_geom
order by count(*) DESC;



WITH points as
(
 SELECT gid, (ST_DumpPoints(geom)).geom AS p from schooldistricts WHERE mtfcc IN ('G5410')
)
SELECT count(*) AS number_of, p FROM points
GROUP BY gid, p
HAVING count(*) > 1
ORDER BY number_of DESC;


-- DROP TABLE schooldistricts_medium_with_features_b;
CREATE TABLE schooldistricts_medium_with_features_b_ AS
WITH points as
(
 SELECT gid, (ST_DumpPoints(geom)).geom AS p from schooldistricts WHERE mtfcc IN ('G5410')
)
SELECT gid, ST_MakePolygon(ST_ForceClosed(ST_MakeLine(p))) AS geom
FROM points
WHERE p IN
(
	SELECT p FROM points
	GROUP BY gid, p
	HAVING count(*) = 1
)
GROUP BY gid;



SELECT * FROM schooldistricts WHERE gid = 102;



SELECT * FROM schooldistricts WHERE mtfcc IN ('G5410')

-- DROP TABLE schooldistricts_medium_with_features_b;
CREATE TABLE schooldistricts_medium_with_features_b AS
WITH geoms (geom) as 
   (SELECT (ST_Dump(ST_Union(geom))).geom from schooldistricts WHERE mtfcc IN ('G5410'))
SELECT p.leaid, g.geom
   FROM schooldistricts p, geoms g 
   WHERE St_Intersects(p.geom, g.geom) AND p.mtfcc IN ('G5410')
   GROUP BY p.leaid, g.geom;

SELECT gid, (array_agg(geom))[1] AS geom
FROM
(
	SELECT gid, ST_GeometryN(m.geom, generate_series(1, ST_NumGeometries(m.geom))) AS geom
	FROM schooldistricts_medium m
	INNER JOIN schooldistricts USING (gid)
	WHERE mtfcc IN ('G5410')
	GROUP BY gid
	ORDER BY gid, ST_Area(m.geom) DESC
) foo
GROUP BY gid


SELECT gid, ST_Union(geom) AS geom FROM schooldistricts WHERE mtfcc = 'G5410' GROUP BY gid ;
SELECT gid AS geom FROM schooldistricts WHERE mtfcc = 'G5410' GROUP BY gid ;

SELECT enr_tot, tot_enr FROM schooldistricts INNER JOIN oos_data ON schooldistricts.leaid = oos_data.nces_leaid::TEXT LIMIT 10;WHERE enr_tot <> tot_enr::TEXT;

SELECT * FROM schooldistricts LIMIT 10;

CREATE TABLE schooldistricts_low_with_features AS
SELECT a.gid, a.geom, "name" AS "Name", cpct_abs AS "Absent Group", tot_absent::INT AS "Total Absent", round(pct_abs * 100, 2)::TEXT || '%' AS "Percent Absent"
FROM schooldistricts_low AS a
INNER JOIN schooldistricts USING (gid);

CREATE TABLE schooldistricts_lower_with_features AS
SELECT a.gid, a.geom, "name" AS "Name", cpct_abs AS "Absent Group", tot_absent::INT AS "Total Absent", round(pct_abs * 100, 2)::TEXT || '%' AS "Percent Absent"
FROM schooldistricts_lower AS a
INNER JOIN schooldistricts USING (gid);

CREATE TABLE schooldistricts_lowest_with_features AS
SELECT a.gid, a.geom, "name" AS "Name", cpct_abs AS "Absent Group", tot_absent::INT AS "Total Absent", round(pct_abs * 100, 2)::TEXT || '%' AS "Percent Absent"
FROM schooldistricts_lowest AS a
INNER JOIN schooldistricts USING (gid);




"Name" "Absent Group" "Total Enrolled" "Total Absent" "Percent Absent" "Layer Group"

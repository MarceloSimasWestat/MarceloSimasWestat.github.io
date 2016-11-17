DROP TABLE IF EXISTS schooldistricts_medium_with_features_not_simplified;
CREATE TABLE schooldistricts_medium_with_features_not_simplified AS
SELECT schooldistricts.gid, schooldistricts.geom,
	regions."name" AS "a",
	schooldistricts."name" AS "b",
	member::INT AS "c",
	outlets::INT AS "d",
	round(kidcircpers::NUMERIC)::TEXT || '%' AS "e",
	COALESCE(kidcircpersc, '0') AS "f",
	round(povpct_age517fam::NUMERIC)::TEXT || '%' AS "g",
	round(minoritypct::NUMERIC)::TEXT || '%' AS "h"
FROM
(
	SELECT *
	FROM schooldistricts
	/* There are districts missing from the simplified output table, so we have to cheat and stick them in their own priority layer */
	WHERE leaid IN ('1717903','3200450','3418270','0623130','3408280','0634290','4606960')
) schooldistricts
INNER JOIN regions USING (statefp)
INNER JOIN kidcircpersc_data ON schooldistricts.leaid = kidcircpersc_data.leaid::TEXT;


DROP TABLE IF EXISTS schooldistricts_medium_with_features_g5420_g5400;
CREATE TABLE schooldistricts_medium_with_features_g5420_g5400 AS
SELECT a.gid, a.geom,
	regions."name" AS "a",
	schooldistricts."name" AS "b",
	member::INT AS "c",
	outlets::INT AS "d",
	round(kidcircpers::NUMERIC)::TEXT || '%' AS "e",
	COALESCE(kidcircpersc, '0') AS "f",
	round(povpct_age517fam::NUMERIC)::TEXT || '%' AS "g",
	round(minoritypct::NUMERIC)::TEXT || '%' AS "h"
FROM schooldistricts_medium AS a
INNER JOIN schooldistricts USING (gid)
INNER JOIN regions USING (statefp)
INNER JOIN kidcircpersc_data ON schooldistricts.leaid = kidcircpersc_data.leaid::TEXT
-- LEFT JOIN kidcircpersc USING (kidcircpersc)
WHERE mtfcc IN ('G5420','G5400');


DROP TABLE IF EXISTS schooldistricts_medium_with_features_g5410;
CREATE TABLE schooldistricts_medium_with_features_g5410 AS
SELECT a.gid, a.geom,
	regions."name" AS "a",
	schooldistricts."name" AS "b",
	member::INT AS "c",
	outlets::INT AS "d",
	round(kidcircpers::NUMERIC)::TEXT || '%' AS "e",
	COALESCE(kidcircpersc, '0') AS "f",
	round(povpct_age517fam::NUMERIC)::TEXT || '%' AS "g",
	round(minoritypct::NUMERIC)::TEXT || '%' AS "h"
FROM schooldistricts_medium AS a
INNER JOIN schooldistricts USING (gid)
INNER JOIN regions USING (statefp)
INNER JOIN kidcircpersc_data ON schooldistricts.leaid = kidcircpersc_data.leaid::TEXT
-- LEFT JOIN kidcircpersc USING (kidcircpersc)
LEFT JOIN
( /* This subquery removes internal boundaries of a multipolygon by searching for duplicate points (shared borders) and removing all of those records - http://gis.stackexchange.com/questions/113029/polygon-from-line-creation-problem */
	WITH points as
	(
	 SELECT gid, (ST_DumpPoints(geom)).geom AS p
	 from schooldistricts
	 WHERE mtfcc IN ('G5410')
	)
		SELECT gid, ST_MakePolygon(ST_Simplify(ST_ForceClosed(ST_MakeLine(p)), 0.0001)) AS geom
		FROM points
		WHERE NOT p IN
		(
			SELECT p
			FROM points
			GROUP BY gid, p
			HAVING count(*) > 1
		)
		GROUP BY gid
) AS merged_districts ON merged_districts.gid = a.gid
WHERE mtfcc IN ('G5410');


DROP TABLE IF EXISTS schooldistricts_medium_state_borders;
CREATE TABLE schooldistricts_medium_state_borders AS
SELECT row_number() OVER () AS gid, state, geom
FROM
(
	SELECT a AS state, st_union(geom) AS geom
	FROM schooldistricts_medium_with_features_g5420_g5400
	GROUP BY a
) foo;
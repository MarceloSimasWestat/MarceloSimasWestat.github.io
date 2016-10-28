DROP TABLE IF EXISTS schooldistricts_medium_with_features_not_simplified;
CREATE TABLE schooldistricts_medium_with_features_not_simplified AS
SELECT schooldistricts.gid, schooldistricts.geom,
	regions."name" AS "a",
	schooldistricts."name" AS "b",
	tot_psenr::INT AS "c",
	g01_g02::INT AS "d",
	round(pct_psenr::NUMERIC * 100)::TEXT || '%' AS "e",
	COALESCE(cpct_psenr, '0') AS "f"
FROM
(
	SELECT *
	FROM schooldistricts
	/* There are districts missing from the simplified output table, so until we know why they are missing just stick them in their own 'prioritized' layer */
	WHERE leaid IN ('1717903','3200450','3418270','0623130','3408280','0634290','4606960')
) schooldistricts
INNER JOIN regions USING (statefp)
INNER JOIN cpct_psenr_data ON schooldistricts.leaid = cpct_psenr_data.leaid::TEXT;


DROP TABLE IF EXISTS schooldistricts_medium_with_features_g5420_g5400;
CREATE TABLE schooldistricts_medium_with_features_g5420_g5400 AS
SELECT a.gid, a.geom,
	regions."name" AS "a",
	schooldistricts."name" AS "b",
	tot_psenr::INT AS "c",
	g01_g02::INT AS "d",
	round(pct_psenr::NUMERIC * 100)::TEXT || '%' AS "e",
	COALESCE(cpct_psenr, '0') AS "f"
FROM schooldistricts_medium AS a
INNER JOIN schooldistricts USING (gid)
INNER JOIN regions USING (statefp)
INNER JOIN cpct_psenr_data ON schooldistricts.leaid = cpct_psenr_data.leaid::TEXT
WHERE mtfcc IN ('G5420','G5400');


DROP TABLE IF EXISTS schooldistricts_medium_with_features_g5410;
CREATE TABLE schooldistricts_medium_with_features_g5410 AS
SELECT a.gid, a.geom,
	regions."name" AS "a",
	schooldistricts."name" AS "b",
	tot_psenr::INT AS "c",
	g01_g02::INT AS "d",
	round(pct_psenr::NUMERIC * 100)::TEXT || '%' AS "e",
	COALESCE(cpct_psenr, '0') AS "f"
FROM schooldistricts_medium AS a
INNER JOIN schooldistricts USING (gid)
INNER JOIN regions USING (statefp)
INNER JOIN cpct_psenr_data ON schooldistricts.leaid = cpct_psenr_data.leaid::TEXT
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
SELECT row_number() OVER () AS gid, geom, state,
		CASE WHEN abbreviation IN ('AL','AR','AZ','CA','CO','CT','DE','GA','HI','IL','KY','LA','MA','MD','ME','MI','MN','MT','NC','NJ','NM','NV','NY','OH','OR','PA','RI','TN','VA','VT','WA','WI')
		THEN 1
		ELSE 0
		END AS ps_grant
FROM
(
	SELECT a AS state, st_union(geom) AS geom
	FROM schooldistricts_medium_with_features_g5420_g5400
	GROUP BY a
) foo
INNER JOIN regions ON regions.name = foo.state;

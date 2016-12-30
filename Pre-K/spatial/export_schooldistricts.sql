-- DROP TABLE schooldistricts_medium_with_features_g5420_g5400;
CREATE TABLE schooldistricts_medium_with_features_g5420_g5400 AS
SELECT a.gid, a.geom,
	regions."name" AS "State",
	schooldistricts."name" AS "Name",
	COALESCE(coos_pct.label, 'Null or missing data') AS "OOS Group",
	oos_tot::INT AS "Total Students OOS",
	round(oos_pct::NUMERIC * 100, 2)::TEXT || '%' AS "Percent OOS",
	oos_data.enr_tot::INT AS "Total Enrollment"
FROM schooldistricts_medium AS a
INNER JOIN schooldistricts USING (gid)
INNER JOIN regions USING (statefp)
INNER JOIN oos_data ON schooldistricts.leaid = oos_data.nces_leaid::TEXT
LEFT JOIN cpct_abs USING (cpct_abs)
LEFT JOIN coos_pct USING (coos_pct)
WHERE mtfcc IN ('G5420','G5400');


-- DROP TABLE schooldistricts_medium_with_features_g5410;
CREATE TABLE schooldistricts_medium_with_features_g5410 AS
SELECT a.gid, merged_districts.geom AS geom,
	regions."name" AS "State",
	schooldistricts."name" AS "Name",
	COALESCE(coos_pct.label, 'Null or missing data') AS "OOS Group",
	oos_tot::INT AS "Total Students OOS",
	round(oos_pct::NUMERIC * 100, 2)::TEXT || '%' AS "Percent OOS",
	oos_data.enr_tot::INT AS "Total Enrollment"
FROM schooldistricts_medium AS a
INNER JOIN schooldistricts USING (gid)
INNER JOIN regions USING (statefp)
INNER JOIN oos_data ON schooldistricts.leaid = oos_data.nces_leaid::TEXT
LEFT JOIN cpct_abs USING (cpct_abs)
LEFT JOIN coos_pct USING (coos_pct)
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
WHERE mtfcc IN ('G5410')
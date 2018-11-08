DROP TABLE IF EXISTS schooldistricts_medium_with_features_not_simplified;
CREATE TABLE schooldistricts_medium_with_features_not_simplified AS
SELECT schooldistricts.gid, schooldistricts.geom,
	regions."name" AS "State",
	schooldistricts."name" AS "District",
	student_total::INT AS "Total number of students",
	chronabs_total::INT AS "Number chronically absent",
	CASE
		WHEN chronabs_percent = '*'
		THEN '*'
		WHEN chronabs_percent::NUMERIC < 0.001
		THEN round(chronabs_percent::NUMERIC * 100, 2)::TEXT || '%'
		ELSE round(chronabs_percent::NUMERIC * 100, 1)::TEXT || '%'
	END AS "Percent chronically absent",
--	chronabs_percent::TEXT AS "Percent chronically absent",
	chronabs_map_category::TEXT AS "Category"
-- chronabs_map_category_text::TEXT "Percent chronically absent, categorized",
FROM
(
	SELECT *
	FROM schooldistricts
	-- ** There are districts missing from the simplified output table, so until we know why they are missing just stick them in their own 'prioritized' layer **
	-- SELECT string_agg(quote_literal(leaid),',') FROM schooldistricts WHERE NOT gid IN (SELECT gid FROM schooldistricts_medium WHERE NOT gid::TEXT in (SELECT leaid FROM schooldistricts) ORDER BY gid::INT)
	WHERE leaid IN ('3407710','1717903','0623130','0634290','3200450','3408280','4606960','6000030','6600040','6900030','7200030','7800030','3600087')
) AS schooldistricts
INNER JOIN regions USING (statefp)
INNER JOIN chronabs_data ON schooldistricts.leaid = chronabs_data.leaid::TEXT;


DROP TABLE IF EXISTS schooldistricts_medium_with_features_g5420_g5400;
CREATE TABLE schooldistricts_medium_with_features_g5420_g5400 AS
SELECT a.gid, a.geom,
	regions."name" AS "State",
	schooldistricts."name" AS "District",
	student_total::INT AS "Total number of students",
	chronabs_total::INT AS "Number chronically absent",
	CASE
		WHEN chronabs_percent = '*'
		THEN '*'
		WHEN chronabs_percent::NUMERIC < 0.001
		THEN round(chronabs_percent::NUMERIC * 100, 2)::TEXT || '%'
		ELSE round(chronabs_percent::NUMERIC * 100, 1)::TEXT || '%'
	END AS "Percent chronically absent",
--	chronabs_percent::TEXT AS "Percent chronically absent",
	chronabs_map_category::TEXT AS "Category"
-- chronabs_map_category_text::TEXT "Percent chronically absent, categorized",
FROM schooldistricts_medium AS a
INNER JOIN schooldistricts USING (gid)
INNER JOIN regions USING (statefp)
INNER JOIN chronabs_data ON schooldistricts.leaid = chronabs_data.leaid::TEXT
WHERE mtfcc IN ('G5420','G5400');


DROP TABLE IF EXISTS schooldistricts_medium_with_features_g5410;
CREATE TABLE schooldistricts_medium_with_features_g5410 AS
SELECT a.gid, a.geom,
	regions."name" AS "State",
	schooldistricts."name" AS "District",
	student_total::INT AS "Total number of students",
	chronabs_total::INT AS "Number chronically absent",
	CASE
		WHEN chronabs_percent = '*'
		THEN '*'
		WHEN chronabs_percent::NUMERIC < 0.001
		THEN round(chronabs_percent::NUMERIC * 100, 2)::TEXT || '%'
		ELSE round(chronabs_percent::NUMERIC * 100, 1)::TEXT || '%'
	END AS "Percent chronically absent",
--	chronabs_percent::TEXT AS "Percent chronically absent",
	chronabs_map_category::TEXT AS "Category"
-- chronabs_map_category_text::TEXT "Percent chronically absent, categorized",
FROM schooldistricts_medium AS a
INNER JOIN schooldistricts USING (gid)
INNER JOIN regions USING (statefp)
INNER JOIN chronabs_data ON schooldistricts.leaid = chronabs_data.leaid::TEXT
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
		CASE WHEN abbreviation IN ('CA','CO','DE','GA','KY','MI','MN','NC','NM','OH','OR','PA','WA','WI')
		THEN 1 -- RTT-ELC grant only states
		WHEN abbreviation IN ('AL','AR','AZ','CT','HI','LA','ME','MT','NV','NY','TN','VA')
		THEN 2 -- PDG grant only states
		WHEN abbreviation IN ('IL','MA','MD','NJ','VT','RI')
		THEN 3 -- RTT-ELC & PDG grant states
		ELSE 0
		END AS ps_grant
FROM
(
	SELECT "State" AS state, st_union(geom) AS geom
	FROM schooldistricts_medium_with_features_g5420_g5400
	GROUP BY "State"
) foo
INNER JOIN regions ON regions.name = foo.state;

/*
SELECT string_agg(quote_literal(abbreviation),',' ORDER BY abbreviation) FROM regions WHERE name IN ('California','Colorado','Delaware','Georgia','Kentucky','Michigan','Minnesota','New Mexico','North Carolina','Ohio','Oregon','Pennsylvania','Washington','Wisconsin');
-- 'CA','CO','DE','GA','KY','MI','MN','NC','NM','OH','OR','PA','RI','WA','WI'
SELECT string_agg(quote_literal(abbreviation),',' ORDER BY abbreviation) FROM regions WHERE name IN ('Alabama','Arkansas','Arizona','Connecticut','Hawaii','Louisiana','Maine','Montana','Nevada','New York','Tennessee','Virginia');
-- 'AL','AR','AZ','CT','HI','LA','ME','MT','NV','NY','RI','TN','VA'
SELECT string_agg(quote_literal(abbreviation),',' ORDER BY abbreviation) FROM regions WHERE name IN ('Illinois','Maryland','Massachusetts','New Jersey','Vermont','Rhode Island');
-- 'IL','MA','MD','NJ','VT'
*/
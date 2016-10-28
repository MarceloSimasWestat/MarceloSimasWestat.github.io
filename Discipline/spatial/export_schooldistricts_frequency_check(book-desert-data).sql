-- DONT FORGET ABOUT THESE 
SELECT * FROM schooldistricts WHERE leaid IN ('6000030','6600040','6900030','7200030','7800030');

/* secondary count */
SELECT
	CASE WHEN mtfcc IN ('G5410') THEN 'unified' WHEN mtfcc IN ('G5420','G5400') THEN 'secondary' ELSE NULL END AS layer, COUNT(*)
FROM kidcircpersc_data
INNER JOIN schooldistricts USING (leaid)
INNER JOIN
(
	SELECT * FROM schooldistricts_medium_with_features_g5410
	UNION ALL
	SELECT * FROM schooldistricts_medium_with_features_not_simplified WHERE gid = (SELECT gid FROM schooldistricts WHERE leaid = '1717903')
) schooldistricts_merged USING (gid)
WHERE kidcircl = '0'
GROUP BY layer;
/*
Secondary:
null member: 86
0 member: 1
null kidcirc: 0
0 kidcric: 92
*/

/* unified count */
SELECT
	CASE WHEN mtfcc IN ('G5410') THEN 'unified' WHEN mtfcc IN ('G5420','G5400') THEN 'secondary' ELSE NULL END AS layer, COUNT(*)
FROM kidcircpersc_data
INNER JOIN schooldistricts USING (leaid)
INNER JOIN
(
	SELECT * FROM schooldistricts_medium_with_features_g5420_g5400
	UNION ALL
	SELECT * FROM schooldistricts_medium_with_features_not_simplified WHERE gid IN (SELECT gid FROM schooldistricts WHERE leaid IN ('3200450','3418270','0623130','3408280','0634290','4606960'))
) schooldistricts_merged USING (gid)
WHERE kidcircl = '0'
GROUP BY layer;

/*
Elementary/Unified:
null member: 128
0 member: 8
null kidcirc: 5
0 kidcric: 3456
*/

SELECT * FROM kidcircpersc_data WHERE member IS NULL ORDER BY leaid
SELECT * FROM kidcircpersc_data WHERE leaid IN ('3200450','3418270','0623130','3408280','0634290','4606960');

SELECT * FROM kidcircpersc_data WHERE kidcircl = '0' AND NOT leaid IN (
SELECT leaid FROM schooldistricts_medium_with_features_g5420_g5400 WHERE d = '0'
UNION ALL
SELECT leaid FROM schooldistricts_medium_with_features_g5410 WHERE d = '0'
UNION ALL
SELECT leaid FROM schooldistricts_medium_with_features_not_simplified WHERE d = '0'
);

SELECT * FROM
(
SELECT * FROM schooldistricts_medium_with_features_g5420_g5400 WHERE d = '0'
UNION 
SELECT * FROM schooldistricts_medium_with_features_g5410 WHERE d = '0'
UNION 
SELECT * FROM schooldistricts_medium_with_features_not_simplified WHERE d = '0'
) foo
WHERE NOT gid IN (SELECT gid FROM kidcircpersc_data INNER JOIN schooldistricts USING (leaid) WHERE kidcircl = '0');


SELECT DISTINCT leaid FROM kidcircpersc_data INNER JOIN schooldistricts USING (leaid)


SELECT * FROM schooldistricts_medium_with_features_g5420_g5400 WHERE d = '0' OR d IS NULL
UNION 
SELECT * FROM schooldistricts_medium_with_features_g5410 WHERE d = '0' OR d IS NULL
UNION 
SELECT * FROM schooldistricts_medium_with_features_not_simplified WHERE d = '0' OR d IS NULL
ORDER BY 6;


SELECT COUNT(*) FROM kidcircpersc_data WHERE kidcircl::INT = 0;
SELECT COUNT(*) FROM kidcircpersc_data WHERE kidcircl = '0';
SELECT * FROM kidcircpersc_data WHERE leaid IN (SELECT leaid FROM schooldistricts WHERE gid IN (1463,9819,3312,3329,6873))
0405320
2309390
2930520
3812990
3816050


SELECT leaid FROM kidcircpersc_data WHERE kidcircl = '0';
SELECT * FROM schooldistricts_medium_with_features_g5420_g5400 WHERE d = '0'
UNION ALL
SELECT * FROM schooldistricts_medium_with_features_g5410 WHERE d = '0'
UNION ALL
SELECT * FROM schooldistricts_medium_with_features_not_simplified WHERE d = '0'
ORDER BY 6
3452
91
5

SELECT * FROM schooldistricts_medium_with_features_g5410 ORDER BY d;


SELECT * FROM
(
SELECT * FROM schooldistricts_medium_with_features_g5420_g5400 WHERE d = '0'
UNION ALL
SELECT * FROM schooldistricts_medium_with_features_g5410 WHERE d = '0'
UNION ALL
SELECT * FROM schooldistricts_medium_with_features_not_simplified WHERE d = '0'
) foo LEFT JOIN schooldistricts USING (gid)
WHERE leaid IN (SELECT leaid FROM kidcircpersc_data WHERE kidcircl = '0')

SELECT leaid FROM kidcircpersc_data WHERE kidcircl = '0' AND NOT leaid IN
(
	SELECT leaid FROM
	(
		SELECT * FROM schooldistricts_medium_with_features_g5420_g5400 WHERE d = '0'
		UNION ALL
		SELECT * FROM schooldistricts_medium_with_features_g5410 WHERE d = '0'
		UNION ALL
		SELECT * FROM schooldistricts_medium_with_features_not_simplified WHERE d = '0'
	) foo LEFT JOIN schooldistricts USING (gid)
)

SELECT * FROM kidcircpersc_data WHERE leaid IN ('6000030','6600040','6900030','7200030','7800030');


SELECT f, label, COUNT(*)
FROM
(
	SELECT * FROM schooldistricts_medium_with_features_g5420_g5400
	UNION ALL
	SELECT * FROM schooldistricts_medium_with_features_g5410
	UNION ALL
	SELECT * FROM schooldistricts_medium_with_features_not_simplified
) foo
INNER JOIN kidcircpersc ON kidcircpersc.kidcircpersc = foo.f
GROUP BY f, label
ORDER BY f;

SELECT * FROM kidcircpersc




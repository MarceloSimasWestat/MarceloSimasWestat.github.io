-- original GEOID of polygon that will not play nice: 1201530
-- gid from schooldistrict_005 (or schooldistrict_12_simple) that is within GEOID 1201530 but malformed:
-- there are two of these malformed polygons but only one GID: 13385

-- Is it that I need to "re-tie" polygons back to original GID?
-- Look at the coat of Florida, GEOID 1200810 - those island polygons are no longer associated to original gid/district ?


-- Visually identifiable areas with polygon issues (two separate polygons/geographies merged into one creates an invalid line connecting the two separate geographies)
-- gid: (135, 140, 167, 201, 380, 246, 398, 401, 434, 441, 5480, 5515, 5520, 7830, 7843, 7905, 7907, 7915, 7968, 7985, 7989, 8021, 8024, 8033, 13317)
SELECT * FROM schooldistricts_medium_with_features_b WHERE gid IN (135, 140, 167, 201, 380, 246, 398, 401, 434, 441, 5480, 5515, 5520, 7830, 7843, 7905, 7907, 7915, 7968, 7985, 7989, 8021, 8024, 8033, 13317)


SELECT * FROM schooldistrict WHERE GEOID = '1200810';

SELECT * FROM schooldistrict WHERE gid = '13385';
SELECT * FROM schooldistrict WHERE gid = '6030';

SELECT * FROM schooldistrict_005 WHERE gid IN ('13385');

SELECT gid, COUNT(*) FROM schooldistrict_5_simple GROUP BY gid HAVING COUNT(*) > 1;

SELECT st_area(geom::geography), st_area(geom::geography) * 0.000000386102
FROM schooldistrict_12
ORDER BY st_area(geom::geography) * 0.000000386102 ASC;

SELECT gid, st_area(geom::geography) * 0.000000386102
FROM schooldistrict_12
ORDER BY gid, st_area(geom::geography) * 0.000000386102 ASC


SELECT gid, st_area(geom::geography) * 0.000000386102, *
FROM schooldistrict_12
WHERE gid IN ('6030','13385');

SELECT gid,  (st_dump(geom)).* FROM schooldistrict WHERE gid = 7835;

ORDER BY gid, st_area(geom::geography) * 0.000000386102 ASC









SELECT DISTINCT gid
FROM
(
	SELECT gid, st_area(geom::geography) * 0.000000386102
	FROM schooldistrict_12
	WHERE st_area(geom::geography) * 0.000000386102 < 0.25
) h
WHERE NOT gid IN (SELECT DISTINCT gid	FROM schooldistrict_12 WHERE st_area(geom::geography) * 0.000000386102 > 0.24)

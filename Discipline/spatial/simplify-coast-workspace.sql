
DROP TABLE usa_48_5m;
CREATE TABLE usa_48_5m AS
SELECT gid, geom --ST_Simplify(usa_5m.geom, 0.001) AS geom
FROM
(
	SELECT gid, (ST_Dump(geom)).geom
	FROM usa_5m
) AS foo
WHERE ST_Area(geom) > 500; -- get a single polygon of the "lower 48"
CREATE INDEX usa_48_5m_idx ON usa_48_5m USING gist(geom);


DROP TABLE delete_alabama;
CREATE TABLE delete_alabama AS
SELECT statefp, m.geom AS geom
FROM schooldistricts_medium AS m
INNER JOIN schooldistricts USING (gid)
WHERE statefp = '01';
--GROUP BY statefp;
CREATE INDEX delete_alabama_idx ON delete_alabama USING gist(geom);

CREATE TABLE delete_alabama_coast AS
SELECT 1 AS gid, ST_Simplify(coast.geom, 0.001) AS geom
FROM coast, delete_alabama AS a
WHERE ST_DWithin(coast.geom::geography, a.geom::geography, 1600);
CREATE INDEX delete_alabama_coast_idx ON delete_alabama_coast USING gist(geom);

DROP TABLE delete_alabama_merged;
CREATE TABLE delete_alabama_merged AS

SELECT 1 AS gid, ST_Multi(ST_Collect(geom)) AS geom
FROM
(
	SELECT statefp AS gid, (ST_Dump(geom)).geom AS geom
	FROM delete_alabama
	UNION ALL
	SELECT gid::TEXT, (ST_Dump(geom)).geom AS geom
	FROM delete_alabama_coast
) AS foo



-- remove parts contained in the "cutter"
DELETE FROM delete_alabama
USING usa_48_5m
WHERE NOT ST_Contains(usa_48_5m.geom, delete_alabama.geom);

-- cut the other parts
UPDATE delete_alabama
SET geom = ST_Multi(ST_Difference(delete_alabama.geom, cutter.geom))
FROM (SELECT ST_Collect(usa_48_5m.geom) geom FROM usa_48_5m) cutter;


SELECT DISTINCT ST_Multi(ST_Difference(delete_alabama.geom, cutter.geom)) AS geom
FROM delete_alabama, (SELECT ST_Collect(usa_48_5m.geom) geom FROM usa_48_5m) cutter;


/* you did it! now go functionalize it */
DROP TABLE delete_alabama_merged;
CREATE TABLE delete_alabama_merged AS
SELECT statefp AS gid, ST_makevalid(ST_Difference(ST_makevalid(geom), (SELECT DISTINCT ST_makevalid(ST_Union(ST_makevalid(ST_Multi(ST_Difference(delete_alabama.geom, cutter.geom))))) AS geom
FROM delete_alabama, (SELECT ST_Collect(usa_48_5m.geom) geom FROM usa_48_5m) cutter))) AS geom
FROM delete_alabama;


DROP TABLE delete_alabama_merged;
CREATE TABLE delete_alabama_merged
AS SELECT m.gid, m.geom
FROM schooldistricts_medium AS m
INNER JOIN schooldistricts USING (gid)
WHERE statefp = '01';

python postgis2geojson-master/postgis2geojson.py -d absenteeism -H atl-pgsqltest.westat.com -P 5432 -u postgres -p postgres1 -t schooldistricts_medium_with_features_g5420_g5400 -g geom -o medium_G5420_G5400 --topojson
python postgis2geojson-master/postgis2geojson.py -d absenteeism -H atl-pgsqltest.westat.com -P 5432 -u postgres -p postgres1 -t schooldistricts_medium_with_features_g5410 -g geom -o medium_G5410 --topojson
python postgis2geojson-master/postgis2geojson.py -d absenteeism -H atl-pgsqltest.westat.com -P 5432 -u postgres -p postgres1 -t schooldistricts_medium_with_features_not_simplified -g geom -o extra_districts --topojson
python postgis2geojson-master/postgis2geojson.py -d absenteeism -H atl-pgsqltest.westat.com -P 5432 -u postgres -p postgres1 -t schooldistricts_medium_state_borders -g geom -o states --topojson
PAUSE
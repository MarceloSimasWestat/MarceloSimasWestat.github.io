library(RPostgreSQL)

server <- "atl-pgsqltest.westat.com" # "atl-pgsqltest.westat.com" 10.146.0.47
tolerance <- 0.01 #0.4  0.01  0.005  0.0005 (high medium low lower)
tolerance_name <- "lowest"
input_geom_table_name <- "schooldistricts"
stash_union <- FALSE # TRUE for intial run
load_stashed_union <- TRUE # TRUE for subsequent runs

pg_con <- dbConnect(dbDriver("PostgreSQL"), host=server, user="postgres", password="postgres1", dbname="absenteeism")

regions <- dbGetQuery(pg_con, "SELECT DISTINCT region FROM regions ORDER BY region")

for (region in  regions[, 1]) { # regions[c(9,10,11), ] # regions[, 1]
	
	sql_string <- paste("
		CREATE TABLE schooldistricts_", region, " AS (SELECT gid, geom FROM ", input_geom_table_name," INNER JOIN regions USING (statefp) WHERE region = ", region,");
		CREATE INDEX schooldistricts_", region,"_geom_idx ON schooldistricts_", region, " USING gist(geom);
		CREATE TABLE schooldistricts_", region, "_", tolerance_name, " AS (SELECT * FROM simplify_geom('public', 'schooldistricts_", region, "', 'gid', 'geom', ", tolerance,", ", stash_union,", ", load_stashed_union,") AS (gid int, geom geometry));
		DROP TABLE schooldistricts_", region, ";
	", sep = "")
	
	# sql_string <- gsub("\r\n", "", sql_string)
		
		# We are sending multiple (presumably why you're here) sql commands via system psql calls to a server with the "wait" parameter set to FALSE. You could max out a client's connections doing this.
		system(
			command = paste(
				"psql.exe -h ", server, " -d absenteeism -U postgres -t -c \"",	sql_string,	"\"",
				sep = ""),
			wait = FALSE
		)

}
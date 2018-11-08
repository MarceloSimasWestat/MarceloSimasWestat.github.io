library(RPostgreSQL)

server <- "dzgis04.westat.com" 
tolerance <- 0.01 #0.4  0.01  0.005  0.0005 (high medium low lower)
tolerance_name <- "medium"
input_geom_table_name <- "schooldistricts"
stash_union <- TRUE # TRUE for intial run
load_stashed_union <- FALSE # TRUE for subsequent runs

username_password <- readLines("C:/username-password.txt")
pg_con <- dbConnect(dbDriver("PostgreSQL"), host=server, user=username_password[1], password=username_password[2], dbname="educ_map")

regions <- dbGetQuery(pg_con, "SELECT DISTINCT region FROM regions ORDER BY region")

for (region in regions[c(4,6), ]) { # regions[c(9,10,11), ] # regions[, 1]
	
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
				"psql.exe -h ", server, " -d educ_map -U ", username_password[1]," -t -c \"",	sql_string,	"\"",
				sep = ""),
			wait = FALSE
		)

}

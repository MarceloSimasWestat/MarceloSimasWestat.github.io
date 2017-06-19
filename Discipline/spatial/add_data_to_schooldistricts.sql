CREATE TABLE interesting_variable (interesting_variable TEXT, label TEXT);
ALTER TABLE interesting_variable ADD PRIMARY KEY (interesting_variable);
-- ^^ now manually insert label lookups into the interesting_variable table

UPDATE interesting_variable_table SET interesting_variable = NULL WHERE btrim(interesting_variable) = '';

-- TRUNCATE kidcircpersc_data;
UPDATE kidcircpersc_data SET leaid  = NULL WHERE btrim(leaid) = '';
UPDATE kidcircpersc_data SET pov_q4_nat  = NULL WHERE btrim(pov_q4_nat) = '';
UPDATE kidcircpersc_data SET minoritycomp  = NULL WHERE btrim(minoritycomp) = '';
UPDATE kidcircpersc_data SET FLAG  = NULL WHERE btrim(FLAG) = '';
UPDATE kidcircpersc_data SET member  = NULL WHERE btrim(member) = '';
UPDATE kidcircpersc_data SET kidcircl  = NULL WHERE btrim(kidcircl) = '';
UPDATE kidcircpersc_data SET kidcircpers  = NULL WHERE btrim(kidcircpers) = '';
UPDATE kidcircpersc_data SET kidcircpersc = NULL WHERE btrim(kidcircpersc) = '';
UPDATE kidcircpersc_data SET povpct_age517fam  = NULL WHERE btrim(povpct_age517fam) = '';
UPDATE kidcircpersc_data SET minoritypct  = NULL WHERE btrim(minoritypct) = '';
UPDATE kidcircpersc_data SET outlets  = NULL WHERE btrim(outlets) = '';
---

UPDATE cpct_psenr_data SET leaid = NULL WHERE btrim(leaid) = '';
UPDATE cpct_psenr_data SET tot_psenr = NULL WHERE btrim(tot_psenr) = '';
UPDATE cpct_psenr_data SET G01_G02 = NULL WHERE btrim(G01_G02) = '';
UPDATE cpct_psenr_data SET st2 = NULL WHERE btrim(st2) = '';
UPDATE cpct_psenr_data SET ps_grant = NULL WHERE btrim(ps_grant) = '';
UPDATE cpct_psenr_data SET pct_psenr = NULL WHERE btrim(pct_psenr) = '';
UPDATE cpct_psenr_data SET cpct_psenr = NULL WHERE btrim(cpct_psenr) = '';

--
-- TRUNCATE oela_data;
UPDATE oela_data SET leaid = NULL WHERE btrim(leaid) = '';
UPDATE oela_data SET el_cat = NULL WHERE btrim(el_cat) = '';
UPDATE oela_data SET el_tot = NULL WHERE btrim(el_tot) = '';
UPDATE oela_data SET student_tot = NULL WHERE btrim(student_tot) = '';
UPDATE oela_data SET el_pct = NULL WHERE btrim(el_pct) = '';


LEAID,tot_psenr,G01_G02,st2,ps_grant,pct_psenr,cpct_psenr
--TRUNCATE public.cpct_psenr_data;

CREATE TABLE public.oela_data (
leaid TEXT,
el_cat TEXT,
el_tot TEXT,
student_tot TEXT,
el_pct TEXT
);
ALTER TABLE public.oela_data ADD PRIMARY KEY (leaid);

CREATE TABLE public.oela (oela TEXT, label TEXT);
ALTER TABLE public.oela ADD PRIMARY KEY (oela);

UPDATE public.oela_data
SET el_tot = replace(el_tot, ',', '')
UPDATE public.oela_data
SET student_tot = replace(student_tot, ',', '')

SELECT DISTINCT el_cat FROM public.oela_data;
SELECT * FROM public.oela;
SELECT * FROM cpct_psenr_data LIMIT 10;
SELECT * FROM public.pk_pctc_data LIMIT 10;

  leaid text,
  pov_q4_nat text,
  minoritycomp text,
  flag text,
  member text,
  kidcircl text,
  kidcircpers text,
  kidcircpersc text,
  povpct_age517fam text,
  minoritypct text,
  outlets text
  
SELECT * FROM coos_pct;

SELECT * FROM oos_data WHERE coos_pct IS NULL;

SELECT * FROM schooldistricts LIMIT 10;

SELECT * FROM oos_data LIMIT 10;

SELECT * FROM oos_data ORDER BY length(oos_pct);

SELECT * FROM kidcircpersc;

SELECT a.gid, a.geom,
	regions."name" AS "State",
	schooldistricts."name" AS "Name"
	--COALESCE(coos_pct.label, 'Null or missing data') AS "OOS Group",
	--oos_tot::INT AS "Total OOS"
	--round(oos_pct::NUMERIC * 100, 2)::TEXT || '%' AS "Percent OOS"
FROM schooldistricts_medium AS a
INNER JOIN schooldistricts USING (gid)
INNER JOIN regions USING (statefp)
INNER JOIN oos_data ON schooldistricts.leaid = oos_data.nces_leaid
LEFT JOIN cpct_abs USING (cpct_abs)
--LEFT JOIN coos_pct USING (coos_pct)
WHERE mtfcc IN ('G5410');
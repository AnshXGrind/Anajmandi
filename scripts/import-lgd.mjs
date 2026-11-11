import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const statesPath = path.join(root, 'supabase', 'seeds', 'lgd_states.csv')
const districtsPath = path.join(root, 'supabase', 'seeds', 'lgd_districts.csv')

function sqlPath(value) {
  return value.replace(/'/g, "''")
}

if (!process.env.SUPABASE_DB_URL) {
  console.error('Set SUPABASE_DB_URL to the target project database connection string.')
  process.exit(1)
}

const sql = `
begin;
create temp table _lgd_states (
  state_code integer, state_name_english text, state_name_local text,
  state_census2011_code text, state_or_ut text, last_updated date
);
create temp table _lgd_districts (
  state_code integer, state_name_english text, state_name_local text,
  state_census2011_code text, district_code integer, district_name_english text,
  district_name_local text, district_census2011_code text
);
\\copy _lgd_states from '${sqlPath(statesPath)}' with (format csv, header true, encoding 'UTF8');
\\copy _lgd_districts from '${sqlPath(districtsPath)}' with (format csv, header true, encoding 'UTF8');
insert into public.india_states (lgd_state_code, name_en, name_local, entity_type, source_updated_at, updated_at)
select state_code, trim(state_name_english), nullif(trim(state_name_local), ''), case when state_or_ut = 'S' then 'State' else 'Union Territory' end, last_updated, now()
from _lgd_states
on conflict (lgd_state_code) do update set
  name_en = excluded.name_en, name_local = excluded.name_local, entity_type = excluded.entity_type,
  source_updated_at = excluded.source_updated_at, is_active = true, updated_at = now();
insert into public.india_districts (lgd_district_code, lgd_state_code, name_en, name_local, source_updated_at, updated_at)
select d.district_code, d.state_code, trim(d.district_name_english), nullif(trim(d.district_name_local), ''), s.last_updated, now()
from _lgd_districts d join _lgd_states s on s.state_code = d.state_code
on conflict (lgd_district_code) do update set
  lgd_state_code = excluded.lgd_state_code, name_en = excluded.name_en, name_local = excluded.name_local,
  source_updated_at = excluded.source_updated_at, is_active = true, updated_at = now();
select * from public.backfill_lgd_location_codes();
notify pgrst, 'reload schema';
commit;
`

await new Promise((resolve, reject) => {
  const child = spawn('psql', [process.env.SUPABASE_DB_URL, '--set', 'ON_ERROR_STOP=1'], { stdio: ['pipe', 'inherit', 'inherit'] })
  child.on('error', reject)
  child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`psql exited with code ${code}`)))
  child.stdin.end(sql)
})

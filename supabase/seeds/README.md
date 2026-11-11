# LGD location seed

Source: Government of India Local Government Directory (LGD), Ministry of
Panchayati Raj, published through the Open Government Data Platform India.

- Portal: https://lgdirectory.gov.in/
- States resource: https://data.gov.in/resource/local-government-directory-lgd-states
- Districts resource: https://data.gov.in/resource/local-government-directory-lgd-districts
- States API resource: `a71e60f0-a21d-43de-a6c5-fa5d21600cdb`
- Districts API resource: `37231365-78ba-44d5-ac22-3deec40b9197`
- Download date: 2026-11-12
- Portal/resource metadata update: 2026-11-11
- Dataset cadence: monthly (the official metadata says it is updated on the first day of each month)
- Imported rows: 36 State/UT records and 785 district records
- SHA-256 states: `A897F9BB1A7B7018EF8CED59E878168B061B5E6D40389BF2DF9E3D63068A31B2`
- SHA-256 districts: `B8901C98350A4057D3371CE14228181E4BB12CC447F847490EFEE599A0E38B59`

The CSVs are the official API CSV exports, not generated application data.
Run `node scripts/validate-lgd.mjs` before importing. Apply
`202611120004_india_location_master.sql` first, then set
`SUPABASE_DB_URL` to the target project's database connection string and run
`node scripts/import-lgd.mjs`. The import is additive/upsert-only, performs
the compatibility backfill, and sends `NOTIFY pgrst, 'reload schema'`.

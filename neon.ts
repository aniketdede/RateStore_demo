// Neon infrastructure config — RateStore (project mute-cloud-20729618)
// Declares Lakebase Postgres service for branch-first workflow.
// Run: npm i @neon/config  (optional; file is valid TypeScript when installed)

export default {
  services: {
    database: {
      provider: 'postgres',
      projectId: 'mute-cloud-20729618',
      orgId: 'org-morning-wave-85454366',
      branch: 'main',
    },
  },
} as const;

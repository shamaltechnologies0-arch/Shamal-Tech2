console.log('\nFix Database Connection (SQLite)\n');
console.log('Common fixes:');
console.log('- Set DATABASE_URL=file:./data/payload.db');
console.log('- Ensure the folder exists and is writable by the app process');
console.log('- If using Turso/libsql, set DATABASE_URL=libsql://... and DB auth token if required\n');

console.log('Check your .env file or deployment environment variables:');
console.log('DATABASE_URL should be one of:');
console.log('  file:./data/payload.db');
console.log('  :memory:');
console.log('  libsql://your-database-host\n');

process.exit(0);

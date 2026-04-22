import 'dotenv/config'

// Validate SQLite/libsql DATABASE_URL format
function testConnectionString() {
  const dbUrl = process.env.DATABASE_URL
  
  if (!dbUrl) {
    console.error('❌ DATABASE_URL is not set in environment variables')
    process.exit(1)
  }
  
  console.log('Current DATABASE_URL format:')
  console.log(dbUrl)
  
  // Check for common issues
  const issues: string[] = []
  
  // Local SQLite path examples: file:./data/payload.db or file:/absolute/path/payload.db
  // Remote libsql example: libsql://db-name.turso.io
  if (dbUrl === ':memory:') {
    console.log('ℹ️  Using in-memory SQLite DB')
  } else if (dbUrl.startsWith('libsql://')) {
    console.log('ℹ️  Using remote libsql database URL')
  } else if (!(dbUrl.startsWith('file:') && dbUrl.endsWith('.db'))) {
    issues.push('For local SQLite, DATABASE_URL should usually be file:... and end with .db')
  }
  
  if (issues.length > 0) {
    console.log('\n⚠️  Potential issues found:')
    issues.forEach(issue => console.log(`  - ${issue}`))
  } else {
    console.log('\n✅ Connection string format looks correct')
  }
  
  return dbUrl
}

// Main
try {
  testConnectionString()
  console.log('\nTo fix authentication issues:')
  console.log('1. For local SQLite, set DATABASE_URL=file:./data/payload.db')
  console.log('2. Ensure the app has write permission to the folder')
  console.log('3. For Turso/libsql, use libsql:// URL and auth token if required')
} catch (error) {
  console.error('Error:', error)
  process.exit(1)
}

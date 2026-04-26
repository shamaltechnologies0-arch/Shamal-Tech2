import 'dotenv/config'

function testConnectionString() {
  const dbUrl = process.env.MONGODB_URI || process.env.DATABASE_URI

  if (!dbUrl) {
    console.error('❌ MONGODB_URI (or DATABASE_URI) is not set in environment variables')
    process.exit(1)
  }

  console.log('Current MongoDB URI (redacted):')
  console.log(dbUrl.replace(/:[^:@]+@/, ':****@'))

  const issues: string[] = []

  if (!dbUrl.startsWith('mongodb://') && !dbUrl.startsWith('mongodb+srv://')) {
    issues.push('URI should start with mongodb:// or mongodb+srv://')
  }

  if (issues.length > 0) {
    console.log('\n⚠️  Potential issues found:')
    issues.forEach((issue) => console.log(`  - ${issue}`))
  } else {
    console.log('\n✅ Connection string format looks OK')
  }

  return dbUrl
}

try {
  testConnectionString()
  console.log('\nTips:')
  console.log('1. Atlas: Network Access → allow Vercel IPs or 0.0.0.0/0 for testing')
  console.log('2. Atlas: Database user with read/write on the target database')
  console.log('3. Set the same MONGODB_URI on Vercel for Production, Preview, and Build')
} catch (error) {
  console.error('Error:', error)
  process.exit(1)
}

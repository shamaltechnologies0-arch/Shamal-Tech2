import 'dotenv/config'

// URL encode a password for MongoDB connection string
function encodePassword(password: string): string {
  return encodeURIComponent(password)
}

// Test connection string format
function testConnectionString() {
  const dbUrl = process.env.DATABASE_URL
  
  if (!dbUrl) {
    console.error('❌ DATABASE_URL is not set in environment variables')
    process.exit(1)
  }
  
  console.log('Current DATABASE_URL format:')
  console.log(dbUrl.replace(/:[^:@]+@/, ':****@'))
  
  // Check for common issues
  const issues: string[] = []
  
  // Check if password contains unencoded special characters
  const urlMatch = dbUrl.match(/mongodb:\/\/([^:]+):([^@]+)@/)
  if (urlMatch) {
    const username = urlMatch[1]
    const password = urlMatch[2]
    
    // Check if password has special characters that might need encoding
    const specialChars = /[\[\]?|!@#$%^&*(){}:;'",.<>\/\\]/
    if (specialChars.test(password) && password === decodeURIComponent(password)) {
      issues.push('Password contains special characters that may need URL encoding')
      console.log('\n⚠️  Password appears to have special characters:')
      console.log(`Original: ${password}`)
      console.log(`Encoded:  ${encodePassword(password)}`)
    }
  }
  
  // Check connection string format
  if (!dbUrl.startsWith('mongodb://') && !dbUrl.startsWith('mongodb+srv://')) {
    issues.push('Connection string must start with mongodb:// or mongodb+srv://')
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
  const connectionString = testConnectionString()
  console.log('\nTo fix authentication issues:')
  console.log('1. Ensure username and password are correct')
  console.log('2. URL-encode special characters in password')
  console.log('3. For DocumentDB, ensure connection string includes:')
  console.log('   ?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false')
  console.log('4. For MongoDB Atlas, use mongodb+srv:// format')
} catch (error) {
  console.error('Error:', error)
  process.exit(1)
}

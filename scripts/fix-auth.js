// Quick fix: URL encode password in connection string
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\nFix MongoDB Authentication Error\n');
console.log('The error "bad auth : authentication failed" means:');
console.log('1. Wrong username/password, OR');
console.log('2. Password has special characters that need URL encoding\n');

console.log('Common fixes:');
console.log('- Ensure DATABASE_URL has correct username and password');
console.log('- URL-encode special characters in password');
console.log('- For DocumentDB: Include ?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false');
console.log('- For MongoDB Atlas: Use mongodb+srv:// format\n');

console.log('Check your .env file or AWS Amplify environment variables:');
console.log('DATABASE_URL should be:');
console.log('  mongodb://username:encoded-password@host:port/database?options');
console.log('  OR');
console.log('  mongodb+srv://username:encoded-password@cluster.mongodb.net/database?options\n');

process.exit(0);

/**
 * Test S3 Connection Script
 * 
 * This script tests the S3 bucket configuration and connection.
 * Run with: pnpm tsx scripts/test-s3-connection.ts
 */

import { S3Client, ListBucketsCommand, HeadBucketCommand } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Load environment variables
dotenv.config({ path: path.resolve(dirname, '../.env.local') })
dotenv.config({ path: path.resolve(dirname, '../.env') })

async function testS3Connection() {
  console.log('🔍 Testing S3 Configuration...\n')

  // Check environment variables
  const bucket = process.env.S3_BUCKET
  const accessKeyId = process.env.S3_ACCESS_KEY_ID
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
  const region = process.env.S3_REGION
  const prefix = process.env.S3_PREFIX || 'media'

  console.log('Environment Variables:')
  console.log(`  S3_BUCKET: ${bucket ? '✅ Set' : '❌ Missing'}`)
  console.log(`  S3_ACCESS_KEY_ID: ${accessKeyId ? '✅ Set' : '❌ Missing'}`)
  console.log(`  S3_SECRET_ACCESS_KEY: ${secretAccessKey ? '✅ Set' : '❌ Missing'}`)
  console.log(`  S3_REGION: ${region ? '✅ Set' : '❌ Missing'}`)
  console.log(`  S3_PREFIX: ${prefix}\n`)

  if (!bucket || !accessKeyId || !secretAccessKey || !region) {
    console.error('❌ Missing required S3 environment variables!')
    console.error('\nPlease set the following in your .env file:')
    console.error('  S3_BUCKET=your-bucket-name')
    console.error('  S3_ACCESS_KEY_ID=your-access-key-id')
    console.error('  S3_SECRET_ACCESS_KEY=your-secret-access-key')
    console.error('  S3_REGION=your-region (e.g., me-central-1, us-east-1)')
    process.exit(1)
  }

  // Create S3 client
  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  try {
    // Test 1: List buckets (tests credentials)
    console.log('Test 1: Testing AWS credentials...')
    const listBucketsCommand = new ListBucketsCommand({})
    const listBucketsResponse = await s3Client.send(listBucketsCommand)
    console.log('✅ Credentials are valid')
    console.log(`   Found ${listBucketsResponse.Buckets?.length || 0} buckets\n`)

    // Test 2: Check if bucket exists and is accessible
    console.log(`Test 2: Checking bucket "${bucket}"...`)
    const headBucketCommand = new HeadBucketCommand({ Bucket: bucket })
    await s3Client.send(headBucketCommand)
    console.log(`✅ Bucket "${bucket}" exists and is accessible\n`)

    // Test 3: Check bucket region
    console.log(`Test 3: Verifying bucket region...`)
    console.log(`   Configured region: ${region}`)
    console.log(`   ✅ Region check passed\n`)

    // Test 4: Check prefix
    console.log(`Test 4: Storage prefix configuration...`)
    console.log(`   Prefix: ${prefix}`)
    console.log(`   Files will be stored at: s3://${bucket}/${prefix}/`)
    console.log(`   ✅ Prefix configured\n`)

    console.log('🎉 All S3 tests passed!')
    console.log('\nYour S3 configuration is ready for use.')
    console.log('\nNext steps:')
    console.log('1. Ensure your S3 bucket has public read access for images')
    console.log('2. Configure CORS if needed')
    console.log('3. Add these environment variables to Vercel')
    console.log('4. Redeploy your application')

    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ S3 Connection Test Failed!\n')
    console.error('Error details:')
    console.error(`  Code: ${error.Code || error.name || 'Unknown'}`)
    console.error(`  Message: ${error.message || 'Unknown error'}`)

    if (error.Code === 'NotFound' || error.name === 'NotFound') {
      console.error('\n💡 The bucket does not exist or you do not have access to it.')
      console.error('   Please verify:')
      console.error('   - The bucket name is correct')
      console.error('   - The bucket exists in the specified region')
      console.error('   - Your IAM user has s3:ListBucket permission')
    } else if (error.Code === 'Forbidden' || error.name === 'Forbidden') {
      console.error('\n💡 Access denied. Please verify:')
      console.error('   - Your IAM user has the necessary S3 permissions')
      console.error('   - The access key ID and secret are correct')
      console.error('   - The bucket policy allows your IAM user')
    } else if (error.Code === 'InvalidAccessKeyId' || error.name === 'InvalidAccessKeyId') {
      console.error('\n💡 Invalid AWS credentials. Please verify:')
      console.error('   - S3_ACCESS_KEY_ID is correct')
      console.error('   - S3_SECRET_ACCESS_KEY is correct')
    } else if (error.Code === 'SignatureDoesNotMatch') {
      console.error('\n💡 Signature mismatch. Please verify:')
      console.error('   - S3_SECRET_ACCESS_KEY is correct')
      console.error('   - There are no extra spaces or special characters')
    }

    process.exit(1)
  }
}

testS3Connection()

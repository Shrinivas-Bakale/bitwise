# Serverless Environment Configuration

## File Upload System

This application has been configured to work in serverless environments like AWS Lambda, which have read-only file systems except for the `/tmp` directory.

### Key Changes Made

1. **Multer Configuration (`utils/multer.js`)**:
   - Modified to use `/tmp` directory in production/serverless environments
   - Falls back to a local 'uploads' directory in development
   - Added error handling for directory creation failures

2. **File Cleanup**:
   - Added cleanup logic to delete temporary files after successful uploads to Cloudinary
   - Implemented error handling to clean up files even when errors occur
   - Prevents filling up the limited `/tmp` storage in serverless environments

3. **Environment Variables**:
   - Added `NODE_ENV` to distinguish between development and production environments
   - Set this to 'production' in serverless deployments

## Deployment Notes

When deploying to a serverless environment like AWS Lambda:

1. Set `NODE_ENV=production` in your environment variables
2. Ensure your Lambda function has permissions to write to the `/tmp` directory
3. Be aware of `/tmp` directory size limits (typically 512MB in AWS Lambda)
4. Consider increasing the Lambda timeout for larger file uploads

## Troubleshooting

If you encounter the "read-only file system" error:
- Verify `NODE_ENV` is set to 'production'
- Check that the multer configuration is using the correct path
- Ensure all file cleanup mechanisms are working properly
- Monitor `/tmp` directory usage to prevent running out of space 
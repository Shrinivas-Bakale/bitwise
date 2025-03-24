# CORS Configuration

## Issue

The application has been configured to handle Cross-Origin Resource Sharing (CORS) with specific settings:

- The server's CORS configuration allows requests from `http://localhost:5174`
- By default, Vite runs the client on `http://localhost:5173`

This mismatch causes CORS errors when making API requests from the client to the server.

## Solution

We've implemented two solutions:

1. **Client port configuration**: Modified `vite.config.js` to run the client on port 5174
   ```js
   server: {
     port: 5174,
   }
   ```

2. **Error handling**: Added CORS-specific error detection and user-friendly messages in the UI

## Alternative Solutions

If changing the client port doesn't work for your setup, you can also:

1. **Update server CORS configuration**: Modify the server to allow requests from your client origin
   ```js
   // Example for Express server
   app.use(cors({
     origin: 'http://localhost:5173',
     credentials: true
   }));
   ```

2. **Use proxy in development**: Configure Vite to proxy API requests
   ```js
   // In vite.config.js
   server: {
     proxy: {
       '/api': {
         target: 'http://localhost:5000',
         changeOrigin: true
       }
     }
   }
   ```

## Running the Application

To avoid CORS issues:
- Make sure to run the client at http://localhost:5174 (default with current config)
- Or update the server's CORS configuration to match your client's origin 
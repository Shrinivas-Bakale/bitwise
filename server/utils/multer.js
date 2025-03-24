import multer from "multer";
import path from "path";
import fs from "fs";

// Define upload path based on environment
// Use /tmp in production/serverless environments which typically have read-only file systems
// Use local 'uploads' folder for development
const uploadDir =
  process.env.NODE_ENV === "production"
    ? "/tmp"
    : path.join(process.cwd(), "uploads");

// Ensure the directory exists
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (error) {
  console.warn(
    `Warning: Could not create upload directory at ${uploadDir}. Using system temp directory instead.`
  );
  // Fallback to OS temp directory if we can't create our preferred directory
}

const upload = multer({ dest: uploadDir });
export default upload;

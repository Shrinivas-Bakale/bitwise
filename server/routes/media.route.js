import express from "express";
import upload from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";
import fs from "fs";

const router = express.Router();

router.route("/upload-video").post(upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMedia(req.file.path);

    // Delete temporary file after successful upload to Cloudinary
    try {
      fs.unlinkSync(req.file.path);
    } catch (cleanupError) {
      console.warn("Warning: Could not delete temporary file:", cleanupError);
    }

    res.status(200).json({
      success: true,
      message: "File uploaded successfully.",
      data: result,
    });
  } catch (error) {
    console.log(error);
    // Attempt to clean up the temporary file even on error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.warn("Warning: Could not delete temporary file:", cleanupError);
      }
    }
    res.status(500).json({ message: "Error uploading file" });
  }
});
export default router;

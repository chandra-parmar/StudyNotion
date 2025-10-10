const cloudinary = require('cloudinary').v2
require('dotenv').config()


//image uploader
const uploadImageToCloudinary = async (file, folder, height, quality) => {
  if (!file?.tempFilePath) {
    throw new Error("File temp path is missing. Upload failed.");
  }

  const options = { folder, resource_type: "auto" };
  if (height) options.height = height;
  if (quality) options.quality = quality;

  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    return result;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw new Error("Cloudinary upload failed");
  }
};

module.exports = uploadImageToCloudinary
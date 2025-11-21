// controllers/SubSection.js (or wherever it is)

const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const  uploadImageToCloudinary  = require("../utils/imageUploader");

// CREATE SubSection
exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, description } = req.body;
    const video = req.files?.video;

    if (!sectionId || !title || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

    const newSubSection = await SubSection.create({
      title,
      description,
      timeDuration: uploadDetails.duration,
      videoUrl: uploadDetails.secure_url,
    });

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: newSubSection._id } },
      { new: true }
    ).populate("subSection").exec();

    // Safety: if section not found
    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedSection,
      message: "SubSection created successfully",
    });
  } catch (error) {
    console.error("Error creating subsection:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create SubSection",
      error: error.message,
    });
  }
};

// UPDATE SubSection
// UPDATE SubSection – FIXED
exports.updateSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId, title, description } = req.body;
    const video = req.files?.video;

    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing subSectionId or sectionId",
      });
    }

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({ success: false, message: "SubSection not found" });
    }

    if (title !== undefined) subSection.title = title;
    if (description !== undefined) subSection.description = description;
    if (video) {
      const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = uploadDetails.duration;
    }

    await subSection.save();

    // THIS IS THE KEY: Always populate and ensure subSection is an array
    const updatedSection = await Section.findById(sectionId)
      .populate("subSection")
      .lean(); // .lean() helps avoid mongoose weirdness

    // FINAL SAFETY NET
    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found after update",
      });
    }

    // Guarantee subSection is an array (Mongoose sometimes returns null)
    updatedSection.subSection = Array.isArray(updatedSection.subSection) ? updatedSection.subSection : [];

    return res.status(200).json({
      success: true,
      data: updatedSection,
      message: "SubSection updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update SubSection",
    });
  }
};

// DELETE SubSection
// DELETE SubSection – FIXED
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;

    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing IDs",
      });
    }

    await Section.findByIdAndUpdate(sectionId, {
      $pull: { subSection: subSectionId },
    });

    await SubSection.findByIdAndDelete(subSectionId);

    const updatedSection = await Section.findById(sectionId)
      .populate("subSection")
      .lean();

    // CRITICAL SAFETY
    const safeSection = updatedSection || { subSection: [] };
    safeSection.subSection = Array.isArray(safeSection.subSection) ? safeSection.subSection : [];

    return res.status(200).json({
      success: true,
      data: safeSection,
      message: "SubSection deleted",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete",
    });
  }
};
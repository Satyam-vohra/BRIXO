const Website = require("../models/Website");
const storage = require("../utils/storage");
const { getIsConnected } = require("../config/db");
const { generateStaticHTML } = require("../utils/htmlGenerator");

const DEFAULT_COLOR_PALETTE = {
  primary: "#4F6EF7",
  secondary: "#7C3AED",
  accent: "#F59E0B",
  background: "#ffffff",
  text: "#1a1a2e",
  reasoning: ""
};

const getUserId = (req) => {
  if (!req.user) return null;
  return req.user._id || req.user.id;
};

const normalizeId = (value) => {
  if (!value) return "";
  return value.toString();
};

const toPlainWebsite = (website) => {
  if (!website) return null;
  if (typeof website.toObject === "function") return website.toObject();
  return website;
};

const buildWebsiteResponse = (website) => {
  const plainWebsite = toPlainWebsite(website);
  const websiteId = plainWebsite._id || plainWebsite.id;

  return {
    id: websiteId,
    userId: plainWebsite.userId,
    title: plainWebsite.title,
    businessType: plainWebsite.businessType,
    fontStyle: plainWebsite.fontStyle,
    colorPalette: plainWebsite.colorPalette,
    blocks: plainWebsite.blocks,
    isPublished: plainWebsite.isPublished,
    publishedUrl: plainWebsite.publishedUrl,
    createdAt: plainWebsite.createdAt,
    updatedAt: plainWebsite.updatedAt
  };
};

const buildPreviewUrl = (req, websiteId) => {
  const host = req.get("host") || `localhost:${process.env.PORT || 5000}`;
  const protocol = req.get("x-forwarded-proto") || (req.secure ? "https" : "http");
  return `${protocol}://${host}/published/${websiteId}`;
};

const getWebsitePayload = (body, userId) => ({
  userId,
  title: body.title || "My BRIXO Website",
  businessType: body.businessType || "Tech",
  fontStyle: body.fontStyle || "Modern",
  colorPalette: {
    ...DEFAULT_COLOR_PALETTE,
    ...(body.colorPalette || {})
  },
  blocks: Array.isArray(body.blocks) ? body.blocks : []
});

const getUpdateFields = (body) => {
  const fields = {};
  if (body.title !== undefined) fields.title = body.title;
  if (body.businessType !== undefined) fields.businessType = body.businessType;
  if (body.fontStyle !== undefined) fields.fontStyle = body.fontStyle;
  if (body.colorPalette !== undefined) {
    fields.colorPalette = {
      ...DEFAULT_COLOR_PALETTE,
      ...body.colorPalette
    };
  }
  if (body.blocks !== undefined) fields.blocks = body.blocks;
  return fields;
};

const validateWebsiteBody = (body) => {
  if (body.blocks !== undefined && !Array.isArray(body.blocks)) {
    return "Blocks must be an array";
  }

  if (body.colorPalette !== undefined && (typeof body.colorPalette !== "object" || Array.isArray(body.colorPalette))) {
    return "Color palette must be an object";
  }

  return null;
};

const findWebsiteById = async (id) => {
  if (getIsConnected()) {
    return Website.findById(id);
  }
  return storage.getWebsiteById(id);
};

const createWebsite = async (websiteData) => {
  if (getIsConnected()) {
    return Website.create(websiteData);
  }
  return storage.saveWebsite(websiteData);
};

const applyWebsiteUpdate = async (id, updateFields) => {
  if (getIsConnected()) {
    return Website.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true
    });
  }
  return storage.updateWebsite(id, updateFields);
};

const isOwner = (website, userId) => {
  const plainWebsite = toPlainWebsite(website);
  if (!plainWebsite.userId) return true;
  return normalizeId(plainWebsite.userId) === normalizeId(userId);
};

const saveOrUpdateWebsite = async (body, userId) => {
  const validationError = validateWebsiteBody(body);
  if (validationError) {
    return { status: 400, error: validationError };
  }

  if (!body.id) {
    const websiteData = getWebsitePayload(body, userId);
    const website = await createWebsite(websiteData);
    return { status: 201, website, created: true };
  }

  const existingWebsite = await findWebsiteById(body.id);
  if (!existingWebsite) {
    return { status: 404, error: "Website not found" };
  }

  if (!isOwner(existingWebsite, userId)) {
    return { status: 403, error: "Not authorized to update this website" };
  }

  const updateFields = getUpdateFields(body);
  const website = await applyWebsiteUpdate(body.id, updateFields);
  return { status: 200, website, created: false };
};

const saveWebsite = async (req, res) => {
  try {
    const result = await saveOrUpdateWebsite(req.body, getUserId(req));

    if (result.error) {
      return res.status(result.status).json({
        success: false,
        message: result.error
      });
    }

    return res.status(result.status).json({
      success: true,
      message: result.created ? "Website saved" : "Website updated",
      data: buildWebsiteResponse(result.website)
    });
  } catch (error) {
    console.error("Save website error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during website saving",
      error: error.message
    });
  }
};

const getWebsite = async (req, res) => {
  const { id } = req.params;

  try {
    const website = await findWebsiteById(id);

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found"
      });
    }

    return res.json({
      success: true,
      data: buildWebsiteResponse(website)
    });
  } catch (error) {
    console.error("Get website error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during website fetching",
      error: error.message
    });
  }
};

const updateWebsite = async (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({
      success: false,
      message: "Please specify the website ID ('id')"
    });
  }

  try {
    const result = await saveOrUpdateWebsite(req.body, getUserId(req));

    if (result.error) {
      return res.status(result.status).json({
        success: false,
        message: result.error
      });
    }

    return res.json({
      success: true,
      message: "Website updated",
      data: buildWebsiteResponse(result.website)
    });
  } catch (error) {
    console.error("Update website error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during website update",
      error: error.message
    });
  }
};

const publishExistingWebsite = async (req, website, websiteId) => {
  const plainWebsite = toPlainWebsite(website);
  const html = generateStaticHTML(
    plainWebsite.blocks || [],
    plainWebsite.colorPalette || DEFAULT_COLOR_PALETTE,
    plainWebsite.fontStyle || "Modern"
  );
  const publishedUrl = buildPreviewUrl(req, websiteId);

  return applyWebsiteUpdate(websiteId, {
    isPublished: true,
    publishedHtml: html,
    publishedUrl
  });
};

const publishWebsite = async (req, res) => {
  const userId = getUserId(req);

  try {
    let website;
    let websiteId = req.body.id;

    if (websiteId) {
      const validationError = validateWebsiteBody(req.body);
      if (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError
        });
      }

      website = await findWebsiteById(websiteId);

      if (!website) {
        return res.status(404).json({
          success: false,
          message: "Website not found"
        });
      }

      if (!isOwner(website, userId)) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to publish this website"
        });
      }

      const updateFields = getUpdateFields(req.body);
      if (Object.keys(updateFields).length > 0) {
        website = await applyWebsiteUpdate(websiteId, updateFields);
      }
    } else {
      const result = await saveOrUpdateWebsite(req.body, userId);
      if (result.error) {
        return res.status(result.status).json({
          success: false,
          message: result.error
        });
      }
      website = result.website;
      websiteId = buildWebsiteResponse(website).id;
    }

    const updatedWebsite = await publishExistingWebsite(req, website, websiteId);
    const data = buildWebsiteResponse(updatedWebsite);

    return res.json({
      success: true,
      message: "Website published",
      data: {
        ...data,
        url: data.publishedUrl
      }
    });
  } catch (error) {
    console.error("Publish website error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during website publishing",
      error: error.message
    });
  }
};

const saveAndPublishWebsite = publishWebsite;

module.exports = {
  saveWebsite,
  getWebsite,
  updateWebsite,
  publishWebsite,
  saveAndPublishWebsite
};

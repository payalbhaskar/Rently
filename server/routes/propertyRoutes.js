
const express = require("express");
console.log("PROPERTY ROUTES FILE LOADED");
const router = express.Router();

const {
    getProperties,
    addProperty
} = require("../controllers/propertyController");

// GET: Retrieve properties
router.get("/", getProperties);

// POST: Submit a new property
router.post("/", addProperty);

module.exports = router;


const express = require("express");
const router = express.Router();

const {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
} = require("../controllers/mongoPropertyController");

// CREATE
router.post("/", createProperty);

// READ all
router.get("/", getProperties);

// READ by ID
router.get("/:id", getPropertyById);

// UPDATE
router.put("/:id", updateProperty);

// DELETE
router.delete("/:id", deleteProperty);

module.exports = router;

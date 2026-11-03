const express = require("express");
const router = express.Router();

const {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
} = require("../controllers/crudController");

// CREATE
router.post("/", createProperty);

// READ ALL
router.get("/", getProperties);

// READ ONE
router.get("/:id", getPropertyById);

// UPDATE
router.put("/:id", updateProperty);

// DELETE
router.delete("/:id", deleteProperty);

module.exports = router;
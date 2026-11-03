// ========================================
// RENTLY - ENQUIRY ROUTES
// PRACTICAL 5
// ========================================

const express = require("express");
console.log("ENQUIRY ROUTES FILE LOADED");
const router = express.Router();

const {
    getEnquiries,
    addEnquiry
} = require("../controllers/enquiryController");

// GET: Retrieve all enquiries
router.get("/", (req, res) => {
    console.log("ENQUIRY GET ROUTE HIT");
    getEnquiries(req, res);
});

// POST: Submit a new enquiry
router.post("/", addEnquiry);

module.exports = router;
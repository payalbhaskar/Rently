// ========================================
// RENTLY - ENQUIRY CONTROLLER
// PRACTICAL 5
// ========================================

// Temporary storage for enquiries
let enquiries = [];

// GET: Retrieve all enquiries
const getEnquiries = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Enquiries retrieved successfully!",
        enquiries: enquiries
    });
};

// POST: Add enquiry with server-side validation
const addEnquiry = (req, res) => {

    const { name, email, message } = req.body;

    const errors = {};

    // Validate name
    if (typeof name !== "string" || !name.trim()) {
        errors.name = "Name is required.";
    }

    // Validate email
    if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
        errors.email = "Enter a valid email address.";
    }

    // Validate message
    if (
        typeof message !== "string" ||
        message.trim().length < 5
    ) {
        errors.message = "Message must contain at least 5 characters.";
    }

    // Return validation errors
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            success: false,
            message: "Please correct the enquiry details.",
            errors: errors
        });
    }

    // Save valid enquiry temporarily
    const newEnquiry = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        message: message.trim()
    };

    enquiries.push(newEnquiry);

    return res.status(201).json({
        success: true,
        message: "Enquiry submitted successfully!",
        enquiry: newEnquiry
    });
};

module.exports = {
    getEnquiries,
    addEnquiry
};
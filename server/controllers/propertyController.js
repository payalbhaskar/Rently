
// Store properties temporarily in an array
let properties = [];

// GET: Retrieve all properties
const getProperties = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Properties retrieved successfully!",
        properties: properties
    });
};

// POST: Add a new property with server-side validation
const addProperty = (req, res) => {

    const {
        name,
        type,
        city,
        rent,
        deposit,
        availableDate,
        facilities,
        description
    } = req.body;

    const errors = {};

    // Validate property name
    if (!name || !name.trim()) {
        errors.name = "Property name is required.";
    }

    // Validate property type
    if (!type || !type.trim()) {
        errors.type = "Property type is required.";
    }

    // Validate city
    if (!city || !city.trim()) {
        errors.city = "City is required.";
    }

    // Validate rent
    if (
        rent === undefined ||
        rent === null ||
        rent === "" ||
        !Number.isFinite(Number(rent)) ||
        Number(rent) <= 0
    ) {
        errors.rent = "Rent must be a valid positive number.";
    }

    // Validate deposit
    if (
        deposit === undefined ||
        deposit === null ||
        deposit === "" ||
        !Number.isFinite(Number(deposit)) ||
        Number(deposit) < 0
    ) {
        errors.deposit = "Deposit must be a valid non-negative number.";
    }

    // Validate available date
    if (!availableDate || isNaN(Date.parse(availableDate))) {
        errors.availableDate = "A valid available date is required.";
    }

    // Validate facilities
    if (!facilities || !facilities.trim()) {
        errors.facilities = "Facilities are required.";
    }

    // Validate description
    if (!description || !description.trim()) {
        errors.description = "Description is required.";
    }

    // If validation errors exist, return error response
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            success: false,
            message: "Please correct the invalid property details.",
            errors: errors
        });
    }

    // Save valid property temporarily
    const newProperty = {
        id: Date.now(),
        name: name.trim(),
        type: type.trim(),
        city: city.trim(),
        rent: Number(rent),
        deposit: Number(deposit),
        availableDate,
        facilities: facilities.trim(),
        description: description.trim()
    };

    properties.push(newProperty);

    return res.status(201).json({
        success: true,
        message: "Property added successfully!",
        property: newProperty
    });
};

module.exports = {
    getProperties,
    addProperty
};

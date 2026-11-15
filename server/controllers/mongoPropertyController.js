
const Property = require("../Property");

// CREATE property
const createProperty = async (req, res) => {
    try {
        const property = new Property(req.body);
        const savedProperty = await property.save();

        res.status(201).json({
            success: true,
            message: "Property added successfully!",
            property: savedProperty
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ all properties
const getProperties = async (req, res) => {
    try {
        const properties = await Property.find();

        res.status(200).json({
            success: true,
            properties
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// READ property by ID
const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found."
            });
        }

        res.status(200).json({
            success: true,
            property
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid property ID."
        });
    }
};

// UPDATE property
const updateProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Property updated successfully!",
            property
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE property
const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Property deleted successfully!",
            property
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid property ID."
        });
    }
};

module.exports = {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
};

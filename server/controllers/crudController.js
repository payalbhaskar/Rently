const pool = require("../db");

// CREATE PROPERTY
const createProperty = async (req, res) => {
    try {
        const {
            property_name,
            property_type,
            city,
            rent,
            deposit,
            available_date,
            facilities,
            description
        } = req.body;

        if (!property_name || !property_type || !city || rent === undefined ||
            rent === null || rent === "" || Number(rent) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid property details."
            });
        }

        const result = await pool.query(
            `INSERT INTO properties
            (property_name, property_type, city, rent, deposit,
             available_date, facilities, description)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
                property_name,
                property_type,
                city,
                rent,
                deposit || 0,
                available_date || null,
                facilities || "",
                description || ""
            ]
        );

        res.status(201).json({
            success: true,
            message: "Property created successfully!",
            property: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// READ ALL PROPERTIES
const getProperties = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM properties ORDER BY id"
        );

        res.status(200).json({
            success: true,
            properties: result.rows
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// READ SINGLE PROPERTY
const getPropertyById = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM properties WHERE id = $1",
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Property not found."
            });
        }

        res.status(200).json({
            success: true,
            property: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE PROPERTY
const updateProperty = async (req, res) => {
    try {
        const {
            property_name,
            property_type,
            city,
            rent,
            deposit,
            available_date,
            facilities,
            description
        } = req.body;

        const result = await pool.query(
            `UPDATE properties SET
            property_name = $1,
            property_type = $2,
            city = $3,
            rent = $4,
            deposit = $5,
            available_date = $6,
            facilities = $7,
            description = $8
            WHERE id = $9
            RETURNING *`,
            [
                property_name,
                property_type,
                city,
                rent,
                deposit,
                available_date || null,
                facilities || "",
                description || "",
                req.params.id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Property not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Property updated successfully!",
            property: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE PROPERTY
const deleteProperty = async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM properties WHERE id = $1 RETURNING *",
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Property not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Property deleted successfully!",
            property: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
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
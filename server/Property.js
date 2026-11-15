
const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    property_name: {
        type: String,
        required: [true, "Property name is required"],
        trim: true
    },

    property_type: {
        type: String,
        required: [true, "Property type is required"],
        enum: ["Apartment", "Hostel/PG", "Vacation Rental"]
    },

    city: {
        type: String,
        required: [true, "City is required"],
        trim: true
    },

    rent: {
        type: Number,
        required: [true, "Rent is required"],
        min: [1, "Rent must be greater than zero"]
    },

    deposit: {
        type: Number,
        default: 0,
        min: 0
    },

    available_date: {
        type: Date
    },

    facilities: {
        type: String,
        trim: true
    },

    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Property", propertySchema);

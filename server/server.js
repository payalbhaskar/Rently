
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to read JSON data
app.use(express.json());
app.use(cors());
// Import property routes
const propertyRoutes = require("./routes/propertyRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const crudRoutes = require("./routes/crudRoutes");
// Use property routes
app.use("/api/properties", propertyRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/crud/properties", crudRoutes);
app.get("/test", (req, res) => {
    res.send("Test route is working!");
});
// Test GET route
app.get("/", (req, res) => {
    res.send("Rently Node.js Server is running successfully!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Rently server running at http://localhost:${PORT}`);
});

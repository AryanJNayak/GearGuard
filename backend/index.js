const express = require('express')
const app = express()

const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const teamRoutes = require("./routes/teamRoutes");
const userRoutes = require("./routes/userRoutes");
const equipmentRoutes = require("./routes/equipmentRoutes");
const requestRoutes = require("./routes/requestRoutes");



const { BackendConfig, DatabaseConfig } = require('./config');
const PORT = BackendConfig.PORT;


// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies


// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/users", userRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/requests", requestRoutes);

const { initDB } = require("./models");
initDB();



app.listen(PORT, () => {
    console.log(`Started Server on the server on PORT: ${PORT}`);
})
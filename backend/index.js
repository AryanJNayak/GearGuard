const express = require('express')
const app = express()

const { BackendConfig, DatabaseConfig } = require('./config');
const PORT = BackendConfig.PORT;



const { initDB } = require("./models");
initDB();



app.listen(PORT, () => {
    console.log(`Started Server on the server on PORT: ${PORT}`);
})
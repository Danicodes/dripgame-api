const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();

// Enable json parsing iirc
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE'] // Not implementing anything requiring put atm
})); // CROSS-ORIGIN RESOURCE SHARING and not x-origin requests like SOME people thought

const configRoutes = require('./routes');
configRoutes(app);

app.listen(3005, ()=> {
    console.log("Server running on http://localhost:3005");
});
const express = require("express");
const dbConnection = require("./config/db");
const routes = require("./routes/employees");
const bodyParser = require("body-parser");
const cors = require("cors");


const app = express();
app.use(cors({ origin: true, credentials: true }));

//DB connection
dbConnection();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",(req,res)=> res.send("Hello world"));
app.use("/api/employees",routes);

const PORT = 3000;

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
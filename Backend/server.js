const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")
dotenv.config();

const accountroutes = require("./routes/AccountRoutes.js");
const authroutes = require("./routes/AuthRoutes.js");
const residentroutes = require("./routes/ResidentRoutes.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/accounts", accountroutes);
app.use("/api/auth", authroutes);
app.use("/api/resident", residentroutes);

app.listen(3000, () => {
    console.log("Running on port 3000!");
})
const path = require("path");
require('dotenv').config({path: path.join(__dirname, '.env')});
const express = require("express");
const cors = require("cors");

const fetchroutes = require("./routes/FetchRoutes.js");
const authroutes = require("./routes/AuthRoutes.js");
const residentroutes = require("./routes/ResidentRoutes.js");
const newsroutes = require("./routes/NewsRoutes.js");
const FormRoute = require("./routes/FormRoute.js");
const accountRoute = require("./routes/AccountRoute.js");

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads/news', express.static(path.join(process.cwd(), 'uploads', 'news')));

app.use("/api/fetch", fetchroutes);
app.use("/api/auth", authroutes);
app.use("/api/resident", residentroutes);
app.use("/api/news", newsroutes);
app.use("/api/forms", FormRoute);
app.use("/api/accounts", accountRoute);

app.listen(3000, () => {
    console.log("Running on port 3000!");
})
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

const allowedOrigins = [
  "http://localhost:5173",
  "https://bmis-pwd-kqx4.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    console.log("Origin:", origin);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads/news", express.static("uploads/news"));

app.use("/api/fetch", fetchroutes);
app.use("/api/auth", authroutes);
app.use("/api/resident", residentroutes);
app.use("/api/news", newsroutes);
app.use("/api/forms", FormRoute);
app.use("/api/accounts", accountRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}!`);
})
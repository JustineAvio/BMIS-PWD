const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")
dotenv.config();

const accountroutes = require("./routes/AdminRoutes.js");
const authroutes = require("./routes/AuthRoutes.js");
const residentroutes = require("./routes/ResidentRoutes.js");
const newsroutes = require("./routes/NewsRoutes.js");
const FormRoute = require("./routes/FormRoute.js");
const path = require('path');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads/news', express.static(path.join(process.cwd(), 'uploads', 'news')));

app.use("/api/admin", accountroutes);
app.use("/api/auth", authroutes);
app.use("/api/resident", residentroutes);
app.use("/api/news", newsroutes);
app.use("/api/forms", FormRoute);

app.listen(3000, () => {
    console.log("Running on port 3000!");
})
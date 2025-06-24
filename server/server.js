const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
require("./config/db");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");


app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);


app.listen(process.env.PORT, () => {
    console.log("Server running at Port ", process.env.PORT);
});
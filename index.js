const express = require("express");
require("dotenv").config();
const path = require("path");

const app = express();
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRouter = require("./routes/authRoute.js");
const postRouter = require("./routes/postRoute.js");

app.use("/api/user", authRouter);
app.use("/api/post", postRouter);

app.get("/", (req, res) => {
  res.send("API is running....");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

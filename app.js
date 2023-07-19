const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const { mongoConnect } = require("./utils/database");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");

const app = express();

const diskStorage = multer.diskStorage({
  filename: (req, file, cb) =>
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ),
  destination: "files",
});

app.use(bodyParser.json());
app.use("/files", express.static(path.join(__dirname, "files")));
app.use(
  multer({ storage: diskStorage }).fields([
    { name: "file", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ])
);

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRoutes);
app.use(postRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  const error = {};
  error.statusCode = err.statusCode || 500;
  error.message = err.message || "Something went wrong.";
  res.status(error.statusCode).json({ error: error });
});

mongoConnect(() => app.listen(8080));

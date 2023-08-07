const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const { init, getUsers } = require("./utils/socketio");
const { mongoConnect } = require("./utils/database");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const diskStorage = multer.diskStorage({
  filename: (req, file, cb) =>
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ),
  destination: "images",
});

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  multer({ storage: diskStorage }).fields([
    { name: "image", maxCount: 1 },
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

app.use(errorHandler);

mongoConnect(() => {
  const io = init(app.listen(8080));
  io.on("connection", (socket) => {
    console.log("A client was connected.");
    socket.on("store_user", (data) => {
      const users = getUsers();
      users[data.userId] = socket.id;
    });
  });
});

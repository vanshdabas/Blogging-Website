const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

// routes
const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const tagRoutes = require("./routes/tag");
const formRoutes = require("./routes/form");

// db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connected"));

app.use(cors());

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", (req, res) => res.send("Backend of application"));

// routes middlewares
app.use("/api", blogRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", tagRoutes);
app.use("/api", formRoutes);

// cors
// if (process.env.NODE_ENV === "development") {
//   app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
// }
// app.use(cors({ origin: `${process.env.CLIENT_URL}` }));

// routes
// app.get("/", (req, res) => {
//   res.json({ name: "atul" });
// });

// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server running at ${port}`));

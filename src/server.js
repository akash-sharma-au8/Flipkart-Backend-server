const express = require("express");
const env = require("dotenv");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
// Routes
const userRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const initialDataRoutes = require("./routes/admin/initialData");
const pageRoutes = require("./routes/admin/page");
const addressRoutes = require("./routes/address");
const orderRoutes = require("./routes/order");
const adminOrderRoute = require("./routes/admin/order");
// environment variables
env.config();

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PWD}@flipkartclone.qpsdx.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log("Database connected Successfully");
  });

app.use(cors());
app.use(bodyParser.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));

//Routes
app.use("/api", userRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialDataRoutes);
app.use("/api", pageRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);
app.use("/api", adminOrderRoute);

app.listen(process.env.PORT, (err) => {
  console.log(`Server is running on ${process.env.PORT}`);
});

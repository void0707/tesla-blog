const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
require("dotenv").config();
app.use(cors());

const corsOptions = { origin: "https://tesla-frontend.onrender.com" };
app.use(express.json());
//connect MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`App is listening on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.status(201).json({ message: "Connected To Backend" });
});

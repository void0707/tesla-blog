const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Parser = require("rss-parser");
const cron = require("node-cron");
require("dotenv").config();
const cheerio = require("cheerio");

const app = express();
app.use(express.json());
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

// Define the schema and model for a Blog
const blogSchema = new mongoose.Schema({
  title: String,
  story: String,
  description: String,
  date: Date,
});

const Blog = mongoose.model("Blog", blogSchema);

// Create an instance of the RSS parser
let parser = new Parser();

// The URL of the RSS feed to parse
const RSS_URL = "http://feeds.feedburner.com/DriveTeslaCanada";

let task = cron.schedule("* * * * *", () => {
  // Runs every hour
  (async () => {
    let feed = await parser.parseURL(RSS_URL);

    for (let item of feed.items) {
      // Check if this post has been extracted before
      let blog = await Blog.findOne({ title: item.title });

      if (!blog) {
        // Store the title in
        let $ = cheerio.load(item["content:encoded"]);

        blog = new Blog({
          title: item.title,
          description: item.contentSnippet,
          story: $.text(),
          date: item.isoDate,
        });
        console.log(item.contentSnippet);

        await blog.save();
      }
    }
  })();
});

task.start();
const corsOptions = { origin: "http://localhost:3000" };
// Create an express application and use cors

app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.status(201).json({ message: "Connected" });
});
// Define an endpoint to get all blogs
app.get("/blogs", async (req, res) => {
  let blogs = await Blog.find({});
  res.json(blogs);
});

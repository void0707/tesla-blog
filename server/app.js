const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Parser = require("rss-parser");
const cron = require("node-cron");
const axios = require("axios");
require("dotenv").config();
const cheerio = require("cheerio");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
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

async function classifyNews(newsTitle) {
  const url = "https://api.openai.com/v1/chat/completions ";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  };
  const prompt = `Write in One word. The following news title is a good news or a bad news: "${newsTitle}"?\nAnswer: `;
  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  const maxTokens = 60;

  const response = await axios.post(url, data, { headers });
  const answer = response.data.choices[0].message.content;
  console.log(answer);
  return answer;
}

let task = cron.schedule("0 * * * *", () => {
  // Runs every hour
  (async () => {
    let feed = await parser.parseURL(RSS_URL);

    for (let item of feed.items) {
      // Check if this post has been extracted before
      let blog = await Blog.findOne({ title: item.title });

      if (!blog) {
        const tex = await classifyNews(item.title);
        console.log(tex);
        if (tex.toLowerCase().includes("bad")) {
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
    }
  })();
});

task.start();
const corsOptions = {
  origin: ["https://tesla-frontend.onrender.com"],
};
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
app.get("/blog/:id", async (req, res) => {
  // Extract id from request parameters
  const id = req.params.id; // Removed parseInt
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).send("Blog Not Found");
    }
    return res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong.");
  }
});

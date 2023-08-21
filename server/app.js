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
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

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
  author: String,
  description: String,
  date: Date,
  image: String,
});

const Blog = mongoose.model("Blog", blogSchema);

// Create an instance of the RSS parser
let parser = new Parser();

// The URL of the RSS feed to parse
const Rssarray = [
  { "Drive Tesla Canada": "http://feeds.feedburner.com/DriveTeslaCanada" },
];

function appendToJSONFile(newBlog, jsonPath) {
  // Step 1: Read the current content of the JSON file.
  const jsonData = fs.readFileSync(jsonPath, "utf-8");

  // Step 2: Parse the content to get the current array of blogs.
  const blogs = JSON.parse(jsonData);

  // Step 3: Push the new blog to the array.
  blogs.push(newBlog);

  // Step 4: Write the updated array back to the JSON file.
  fs.writeFileSync(jsonPath, JSON.stringify(blogs, null, 2));
}
async function classifyNews(newsTitle) {
  const url = "https://api.openai.com/v1/chat/completions ";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  };
  const prompt = `Write in One word (good or bad). The following news title is a good news or a bad news: "${newsTitle}"?\nAnswer: `;
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

function readBlogsFromFile(filePath) {
  const jsonData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(jsonData);
}
function blogExists(blogTitle, filePath) {
  const blogs = readBlogsFromFile(filePath);

  return blogs.some((blog) => blog.title === blogTitle);
}

function truncateText(text) {
  const maxLength = 50; // Set the maximum number of characters

  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
}

const images_links = [
  "https://images.unsplash.com/photo-1617704548623-340376564e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRlc2xhfGVufDB8fDB8fHww&w=1000&q=80",
  "https://cdn.pixabay.com/photo/2021/01/21/11/09/tesla-5937063_640.jpg",
  "https://p1.pxfuel.com/preview/928/948/953/tesla-electric-car-vehicle-car-auto-model-x-royalty-free-thumbnail.jpg",
  "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVzbGF8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
  "https://images.pexels.com/photos/12086520/pexels-photo-12086520.jpeg?cs=srgb&dl=pexels-kevin-burnell-12086520.jpg&fm=jpg",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2Fyc3xlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
  "https://images.unsplash.com/photo-1595788701530-2d3642a509d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExfHx8ZW58MHx8fHx8&w=1000&q=80",
  "https://images.unsplash.com/photo-1590510616176-67c37c34fa28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNoZXZyb2xldHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
];

jsonPath = "../frontend/public/blogs.json";
let task = cron.schedule("0 * * * *", () => {
  // Runs every hour
  (async () => {
    for (let obj of Rssarray) {
      for (let [author_, RSS_URL] of Object.entries(obj)) {
        let feed = await parser.parseURL(RSS_URL);
        console.log(feed);
        let blogs = [];

        for (let item of feed.items) {
          // Check if this post has been extracted before
          if (item.title.toLowerCase().includes("tesla")) {
            let blog = await Blog.findOne({ title: item.title });

            if (!blogExists(item.title, jsonPath)) {
              const tex = await classifyNews(item.title);
              let randomIndex = Math.floor(Math.random() * images_links.length);
              console.log(tex);
              if (tex.toLowerCase().includes("bad")) {
                // Store the title in
                let $ = cheerio.load(item["content:encoded"]);
                const formattedDate = new Date(item.isoDate)
                  .toISOString()
                  .split("T")[0];

                blogJson = {
                  title: item.title,
                  description: truncateText(item.contentSnippet),
                  author: author_,
                  story: $.text(),
                  date: formattedDate,
                  image: images_links[randomIndex],
                  _id: uuidv4(),
                };
                console.log(item.contentSnippet);

                appendToJSONFile(blogJson, jsonPath);
              }
            }
          }
        }
      }
    }
  })();
});

task.start();

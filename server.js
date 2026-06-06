const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();

const API_KEY =
  "지원님기상청apikey";

app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/weather", async (req, res) => {
  try {
    const query = new URLSearchParams(req.query).toString();

    const url =
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/${req.query.endpoint}?${query}`;

    console.log(url);
    const response = await fetch(url);

    const data = await response.json();

    res.json(data);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.listen(3000, () => {
  console.log("server running");
});
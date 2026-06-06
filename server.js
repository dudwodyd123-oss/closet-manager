const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();

const API_KEY =
  "367209827091689d3216d2aa03b8d56e717205e6a7ee49cb27dea0b8391998a5";

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

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log("server running");
});
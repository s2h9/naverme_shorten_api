const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;
app.get("/", async (req, res) => {
  res.send("working");
});
app.get("/shorten", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "url parameter needed." });
    }

    const targetUrl =
      `https://me2do.naver.com/common/requestJsonpV2.nhn` +
      `?svcCode=0&url=https://link.naver.com/bridge?url=${encodeURIComponent(url)}`;

    const response = await axios.post(targetUrl, null, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Referer: "https://link.naver.com/",
        Origin: "https://link.naver.com",
      },
    });

    // JSONP wrapper 제거
    let text = response.data.trim();

    // 예: callback({...});
    if (text.startsWith("(") && text.endsWith(")")) {
      text = text.slice(1, -1);
    }

    //callback(...) 형태일 경우
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    const json = JSON.parse(text);

    res.json({
      success: true,
      shortenUrl: json.result?.httpsUrl || null,
      raw: json,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: "failed to fetch.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

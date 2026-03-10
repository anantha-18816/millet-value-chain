const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.post("/", async (req, res) => {
  try {
    const { message, language } = req.body;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Reply only in ${language}. You are an agricultural assistant helping millet farmers.`
          },
          {
            role: "user",
            content: message
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data.choices[0].message);

  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

module.exports = router;
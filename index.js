const dotenv = require("dotenv");
const fetch = require("node-fetch");
const clipboardy = require("clipboardy");

dotenv.config();

const shortenURL = async (longLink) => {
  try {
    const response = await fetch(`https://kutt.it/api/v2/links`, {
      method: "POST",
      body: JSON.stringify({
        target: longLink,
        reuse: true,
        domain: "https://go.srsh.link/",
      }),
      headers: {
        "content-type": "application/json",
        "X-API-KEY": process.env.KEY,
      },
    });
    const shortLink = await response.json();
    return shortLink;
  } catch (error) {
    console.error(error);
  }
};

const getShortURL = async (link) => {
  const shortLink = await shortenURL(link);
  console.log(shortLink);
};

const targetLink = clipboardy.readSync();
getShortURL(targetLink);

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

    const shortLinkData = await response.json();
    let shortLink = shortLinkData.link;

    const findHTTP = /(?<http>http)/;
    if (findHTTP.exec(shortLink) !== null) {
      const HTTPS = "https";
      shortLink = shortLink.replace(findHTTP, HTTPS);
    }

    clipboardy.writeSync(shortLink);
  } catch (error) {
    console.error(error);
  }
};

const targetLink = clipboardy.readSync();
shortenURL(targetLink);

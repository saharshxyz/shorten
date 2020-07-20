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

    if (shortLink.includes("http", 0)) {
      shortLink = shortLink.replace(/http/, "https");
    }

    clipboardy.writeSync(shortLink);
  } catch (error) {
    console.error(error);
  }
};

const targetLink = clipboardy.readSync();

if (targetLink.includes("http", 0) || targetLink.includes("https", 0)) {
  shortenURL(targetLink);
} else {
  clipboardy.writeSync("Not a valid link. Make sure it has http or https.");
}

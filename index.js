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

    shortLink = shortLink.replace(/http/, "https");
    clipboardy.writeSync(shortLink);
  } catch (error) {
    console.error(error);
  }
};

const run = (longLink) => {
  const startsWIthHTTP = /^http/m;
  if (startsWIthHTTP.exec(longLink) !== null) {
    shortenURL(longLink);
  } else {
    clipboardy.writeSync("Not a valid link. Make sure it has http or https.");
  }
}

const targetLink = clipboardy.readSync();
run(targetLink);
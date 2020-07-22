const dotenv = require("dotenv");
const fetch = require("node-fetch");
const clipboardy = require("clipboardy");
const applescript = require("applescript");

dotenv.config();


const replaceHTTP = (withHTTP) => {
  withHTTP.replace(/http/, "https");
}

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

    
    clipboardy.writeSync(shortLink);
    return replaceHTTP(shortLinkData.link);
  } catch (error) {
    console.error(error);
  }
};


const run = async (longLink) => {
  const startsWIthHTTP = /^http/;
  if (startsWIthHTTP.exec(longLink) !== null) {
    const notification = `display notification "${longLink}" with title "Link Shortened" subtitle "${await shortenURL(
      longLink
    )}" sound name "purr"`;
    applescript.execString(notification);
  } else {
    const notification = `display notification "${longLink}" with title "Invalid Link" subtitle "Make sure link has http or https" sound name "glass"`;
    applescript.execString(notification);
  }
};

const targetLink = clipboardy.readSync();
run(targetLink);

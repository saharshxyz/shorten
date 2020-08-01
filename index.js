const fetch = require("node-fetch");
const clipboardy = require("clipboardy");
const applescript = require("applescript");

require("dotenv").config();

const shorten = async (url, subDomain) => {
  let apiKEY;
  if (subDomain === "sc") {
    apiKEY = process.env.KEY;
  } else if (subDomain === "go") {
    apiKEY = process.env.KEY_2;
  }

  try {
    const response = await fetch("https://kutt.it/api/v2/links", {
      method: "POST",
      body: JSON.stringify({
        target: url.toString(),
        reuse: true,
        domain: `https://${subDomain}.srsh.link/`,
      }),
      headers: {
        "content-type": "application/json",
        "X-API-KEY": apiKEY,
      },
    });
    return (await response.json()).link;
  } catch (error) {
    console.error(error);
  }
};

const shortenURL = async (url) => {
  const shortLink = new URL(
    await shorten(url, url.hostname === "cln.sh" ? "sc" : "go")
  );
  if (shortLink.protocol === "http:") shortLink.protocol = "https:";
  const shortUrl = shortLink.toString();
  clipboardy.writeSync(shortUrl);
  return shortUrl;
};

const run = async (longLink) => {
  if (!longLink.match(/^https?:\/\//)) {
    longLink = `http://${longLink}`;
  }
  let notification;
  try {
    const url = new URL(longLink);
    notification = `display notification "${longLink}" with title "Link Shortened" subtitle "${await shortenURL(
      url
    )}" sound name "purr"`;
  } catch (error) {
    notification = `display notification "${longLink}" with title "Invalid Link" subtitle "Make sure link has http or https" sound name "glass"`;
  }
  applescript.execString(notification);
};

run(clipboardy.readSync());

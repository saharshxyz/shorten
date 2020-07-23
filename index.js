const dotenv = require("dotenv");
const fetch = require("node-fetch");
const clipboardy = require("clipboardy");
const applescript = require("applescript");

dotenv.config();

const shorten = async (url, subDomain) => {
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
        "X-API-KEY": process.env.KEY,
      },
    });
    return (await response.json()).link;
  } catch (error) {
    console.error(error);
  }
};

const shortenURL = async url => {
	const shortLink = await shorten(url, url.hostname === "cln.sh" ? "sc" : "go")
	clipboardy.writeSync(shortLink);
  return shortLink;
};

const run = async longLink => {
  if (!longLink.match(/^https?:\/\//)) longLink = `http://${longLink}`;
	let notification;
	try {
		const url = new URL(longLink);
		notification = `display notification "${longLink}" with title "Link Shortened" subtitle "${await shortenURL(url)}" sound name "purr"`;
	} catch (error) {
    notification = `display notification "${longLink}" with title "Invalid Link" subtitle "Make sure link has http or https" sound name "glass"`;
	}
	applescript.execString(notification);
};

run(clipboardy.readSync());

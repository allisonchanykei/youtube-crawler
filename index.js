const { google } = require("googleapis");
const request = require("request");
const cheerio = require("cheerio");
const config = require("./config/config");
const path = require("path");
const fs = require("fs");

async function getYoutubeSearchResult(query, maxResults, nextPageToken = "") {
    const res = await service.search.list({
        type: "channel",
        q: query,
        part: "snippet",
        maxResults: maxResults
    });
    return res.data;
}

async function getUrls(youtubeUrl, name) {
    request(
        {
            uri: youtubeUrl + "/about"
        },
        function(error, response, body) {
            var facebookUrl = "",
                twitterUrl = "",
                email = "";
            const $ = cheerio.load(body);

            const facebook = $("a[title~='Facebook']");
            if (facebook.length > 0) {
                facebookUrl = facebook[0].attribs.href;
            }
            const twitter = $("a[title~='Twitter']");
            if (twitter.length > 0) {
                twitterUrl = twitter[0].attribs.href;
            }
            var stats = $($("span.about-stat")[0]).text();
            stats = stats.replace(/\,/g, "");
            stats = stats.replace(" • ", "");
            stats = stats.replace(" ", ",");
            stats = stats.trim();

            if (stats.split(" ")[0] < 100) {
                return;
            }

            email = extractEmails(body);
            console.log(name + ", " + youtubeUrl + ", " + facebookUrl + ", " + twitterUrl + ", " + email + ", " + stats);
        }
    );
}

function extractEmails(text) {
    var emails = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
    if (!emails) emails = "";
    else if (emails.length != 1) {
        emails = emails[0];
    }
    return emails;
}

async function fromFile(query) {
    const result = await getYoutubeSearchResult(query, 1);
    if (result.items.length == 0) {
        console.log(query);
        return;
    }
    const youtubeUrl = "https://www.youtube.com/channel/" + result.items[0].id.channelId;
    getUrls(youtubeUrl, query);
}

async function fromString(query, limit) {
    var count = 0;
    const maxResults = 50;
    const pages = limit / maxResults;
    var nextPageToken = "";
    while (count < pages) {
        const result = await getYoutubeSearchResult(query, 50, nextPageToken);
        if (result.items.length == 0) {
            if (nextPageToken == "") {
                console.log("No items found");
            }
            return;
        }
        nextPageToken = result.nextPageToken;

        result.items.forEach(function(item) {
            const youtubeUrl = "https://www.youtube.com/channel/" + item.snippet.channelId;
            const title = item.snippet.channelTitle;
            getUrls(youtubeUrl, title);
        });
        count++;
    }
}

const service = google.youtube({
    version: "v3",
    auth: config.apiKey // specify your API key here
});

var flag = process.argv[2];
if (flag == "-f") {
    var filePath = process.argv[3];
    if (!path.isAbsolute(filePath)) {
        filePath = path.join(process.cwd(), filePath);
    }
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, function(err, data) {
            if (err) {
                return;
            }
            var usernames = data.toString().split("\n");
            usernames.forEach(user => {
                user = user.trim();
                fromFile(user).catch(console.error);
            });
        });
    }
} else if (flag == "-q") {
    var query = process.argv[3];
    var limit = 500;
    if (process.argv.length == 5) {
        limit = process.argv[4];
    }

    fromString(query, limit).catch(console.error);
}

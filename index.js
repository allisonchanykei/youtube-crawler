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
        maxResults: maxResults,
        pageToken: nextPageToken
    });
    return res.data;
}

async function getUrls(youtubeUrl, name) {
    request(
        {
            uri: youtubeUrl + "/about"
        },
        function (error, response, body) {
            var facebookUrl = "",
                twitterUrl = "",
                email = "";
            email = extractEmails(body);
            if (email) {
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

                // if (stats.split(",")[0] < 100) {
                //     return;
                // }

                console.log('"' + name + '", ' + youtubeUrl + ", " + facebookUrl + ", " + twitterUrl + ", " + email + ", " + stats);
            }
        }
    );
}

function extractEmails(text) {
    if (!text) return;
    var emails = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
    if (!emails) emails = "";
    else if (emails.length != 1) {
        emails = emails[0];
    }
    return emails;
}

async function channel(query) {
    const result = await getYoutubeSearchResult(query, 1);
    if (result.items.length == 0) {
        return;
    }
    const youtubeUrl = "https://www.youtube.com/channel/" + result.items[0].id.channelId;
    getUrls(youtubeUrl, query);
}

async function query(query, limit) {
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

        result.items.forEach(function (item) {
            const youtubeUrl = "https://www.youtube.com/channel/" + item.snippet.channelId;
            const title = item.snippet.channelTitle;
            getUrls(youtubeUrl, title);
        });
        if (result.items.length < maxResults) {
            //Last page
            return;
        }
        count++;
    }
}

const service = google.youtube({
    version: "v3",
    auth: config.apiKey // specify your API key here
});
var type = process.argv[2];
var flag = process.argv[3];

var limit = 500;

if (flag == "-f") {
    var filePath = process.argv[4];
    if (!path.isAbsolute(filePath)) {
        filePath = path.join(process.cwd(), filePath);
    }
    if (fs.existsSync(filePath)) {
        var retry = [];
        fs.readFile(filePath, function (err, data) {
            if (err) {
                return;
            }
            var lines = data.toString().split("\n");
            var promises = [];
            lines.forEach(line => {
                line = line.trim();
                //try {
                if (type == "channel") {
                    promises.push(channel(line).catch(function (error) {
                        retry.push(line);
                    }));
                }
                else if (type == "query") {
                    promises.push(query(line, limit).catch(function (error) {
                        retry.push(line);
                    }));
                }
            });

            Promise.all(promises).then(function () {
                retry.forEach(line => {

                    if (type == "channel") {
                        channel(line).catch(console.error);
                    }
                    else if (type == "query") {
                        query(line, limit).catch(console.error);
                    }
                });
            });
        });
    }
} else if (flag == "-s") {
    var input = process.argv[4];
    if (type == "channel") {
        channel(input).catch(console.error);
    }
    else if (type == "query") {
        query(input, limit).catch(console.error);
    }
}

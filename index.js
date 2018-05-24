const { google } = require('googleapis');
const request = require("request");
const cheerio = require('cheerio');
const config = require("./config");
const fs = require("fs");

const service = google.youtube({
    version: 'v3',
    auth: config.apiKey// specify your API key here
});
function extractEmails(text) {
    var emails = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
    if (!emails) emails = "";
    else if (emails.length != 1){
        emails = emails[0];
    }
    return emails;
}
async function main(query) {

    var facebookUrl = "", twitterUrl = "", youtubeUrl = "", email = "";
    const res = await service.search.list({
        type: "channel",
        q: query,
        part: "snippet",
        maxResults: 1
    });
    if (res.data.items.length == 0) {
        console.log(query);
        return;
    }
    youtubeUrl = "https://www.youtube.com/channel/" + res.data.items[0].id.channelId;
    request({
        uri: youtubeUrl + "/about",
    }, function (error, response, body) {
        const $ = cheerio.load(body);

        const facebook = $("a[title~='Facebook']");
        if (facebook.length > 0) {
            facebookUrl = facebook[0].attribs.href;
        }
        const twitter = $("a[title~='Twitter']");
        if (twitter.length > 0) {
            twitterUrl = twitter[0].attribs.href;
        }
        var stats = $($("span.about-stat b")[0]).text();
        stats = stats.replace(/\,/g, '');

        email = extractEmails(body);
        console.log(query + ", " + youtubeUrl + ", " + facebookUrl + ", " + twitterUrl + ", " + email + ", " + stats);
    });
};

var filePath = process.argv[2];
if (fs.existsSync(filePath)) {
    fs.readFile(filePath, function (err, data) {
        if (err) {
            return;
        }
        var usernames = data.toString().split("\n");
        usernames.forEach(user => {
            user = user.trim();
            main(user).catch(console.error);
        });
    })
}
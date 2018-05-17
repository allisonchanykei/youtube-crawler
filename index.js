const { google } = require('googleapis');
const request = require("request");
const cheerio = require('cheerio');
const config = require("./config");

const service = google.youtube({
    version: 'v3',
    auth: config.apiKey// specify your API key here
});

async function main(query) {
    const res = await service.search.list({
        type: "channel",
        q: query,
        part: "snippet",
        maxResults: 1
    });
    const youtubeUrl = "https://www.youtube.com/channel/" + res.data.items[0].id.channelId;
    request({
        uri: youtubeUrl + "/about",
    }, function (error, response, body) {
        const $ = cheerio.load(body);
        var facebookUrl = "", twitterUrl = "";

        const facebook = $("a[title='Facebook']");
        if (facebook.length > 0) {
            facebookUrl = facebook[0].attribs.href;
        }
        const twitter = $("a[title='Twitter']");
        if (twitter.length > 0) {
            twitterUrl = twitter[0].attribs.href;
        }

        console.log(query + ", " + youtubeUrl + ", " + facebookUrl + ", " + twitterUrl);
    });
};
main("bebe milo").catch(console.error);
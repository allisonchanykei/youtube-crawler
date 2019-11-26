## Purpose
Gathers the Youtube URL, Facebook, Twitter, and Email of Youtube channels based on their names or search query. It is especially useful when you are trying to gather a large pool of potential influencers in a short amount of time.

## Dependencies

[Node.js](https://nodejs.org/en/)

[Cheerio (cheerio) Version: 1.0.0-rc.2](https://www.npmjs.com/package/cheerio)

[Google Auth Library (google-auth-library) Version: 1.5.0](https://www.npmjs.com/package/google-auth-library)

[Google APIs Node.js Client (googleapis) Version: 30.0.0](https://www.npmjs.com/package/googleapis)

[Request - Simplified HTTP client (request) Version: 2.86.0](https://www.npmjs.com/package/request)

[Youtube Data API](https://developers.google.com/youtube/v3/getting-started)

## Setup

1.  Download Nodejs (if you haven't already) [here](https://nodejs.org/en/)
2.  Open up your command line client, go to the program directory, run `npm install` to install packages
3.  Retrieve an Youtube Data API key [here](https://developers.google.com/youtube/v3/getting-started)
4.  Paste the key into config/config.js
    
## Usage

1.  To get contact information from channels

    Create a list of channel names in .txt format, then run 
    
    ```node index.js channel -f <path to file>```
    
    or just one channel
    
    ```node index.js channel -s <channel name>```

2.  To get a list of channels with contact information from a Youtube search:

    Create a list of search strings in .txt format, then run 
     
    ```node index.js query -f <path to file>```
    
    or using a single search 
    
    ```node index.js query -s <search string>```

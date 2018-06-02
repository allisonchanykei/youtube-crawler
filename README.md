## Purpose
To computerize the process of gathering information on Youtube channels. 

This program gathers the Youtube, Facebook, Twitter and Email of Youtube channels based on their names or search query. It is especially useful when you are trying to gather a large pool of potential influencers in a short amount of time.

## Setup

1.  Run `npm install`
2.  Get an api key from [Youtube Data API](https://developers.google.com/youtube/v3/getting-started)
3.  Paste the key into config/config.js

## Usage

1.  To get results from a list of channel names from a file:

    Create a list of channel names in txt format then run

    ```
    node index.js -f <path to file>
    ```

2.  To get a list of channels from a search query:

    Run `node index.js -q <query> <optional - maximum number of results>`

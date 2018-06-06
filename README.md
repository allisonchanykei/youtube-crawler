## Purpose
To computerize the process of gathering information on Youtube channels. 

This program gathers the Youtube URL, Facebook, Twitter, and Email of Youtube channels based on their names or search query. It is especially useful when you are trying to gather a large pool of potential influencers in a short amount of time.

## Setup

1.  Run `npm install`
2.  Get an api key from [Youtube Data API](https://developers.google.com/youtube/v3/getting-started)
3.  Paste the key into config/config.js

## Usage

1.  To get contact information from channel:

    Create a list of channel names in txt format, then run 
    ```node index.js channel -f <path to file>```
    or
    ```node index.js channel -s <channel name>```

2.  To get a list of channels with contact information from a search query:

     Create a list of search strings in txt format, then run 
    ```node index.js query -f <path to file>```
    or
    ```node index.js query -s <search string>```

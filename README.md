## Setup

1.  Run `npm install`
2.  Get an api key from [Youtube Data API](https://developers.google.com/youtube/v3/getting-started)
3.  Paste the key into config.js

## Usage

1.  To get results from a list of channel names from a file:

    Create a list of channel names in txt format then run

    ```
    node index.js -f <path to file>
    ```

2.  To get a list of channels from a search query:

    Run `node index.js -q <query> <optional - maximum number of results>`

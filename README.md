# Aify

[Thunderbird addon](https://addons.thunderbird.net/en-GB/thunderbird/addon/aify/) to bring ChatGPT to your emails.

## Configuration and Usage

### Configuration

1. Set an API key in the addons settings menu (obtainable from [OpenAI](https://platform.openai.com/signup/).
2. (Optional) Add, remove or edit the available actions.
3. **Make sure to click save at the bottom of the page**

### Usage

1. Open a new compose window (Write, Reply or Forward).
2. Highlight some text to act one
3. Click the Aify icon in the top right (near the lightbulb) and pick an action
4. A popup will open and await the response from the API. This may take time at periods of high load.

## Building

The contents of `plugin/` should be zipped into a file ending `.xpi`.

```
cd plugin
zip -r ../aify.xpi *
```

## Privacy and Data Retention
 This add-on interfaces with OpenAI's API but collects no data itself other than settings stored locally.
The text is sent to OpenAI's server and managed by their data retention policy

OpenAI's privacy policy can be found at https://openai.com/policies/privacy-policy
OpenAI's API data usage policy is here https://openai.com/policies/api-data-usage-policies

## License

GPLv3


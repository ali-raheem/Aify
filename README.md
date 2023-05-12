# Aify

[Thunderbird addon](https://addons.thunderbird.net/en-GB/thunderbird/addon/aify/) to bring ChatGPT to your emails.

## Configuration and Usage

### Configuration

1. Set an API key in the addons settings menu (obtainable from [OpenAI](https://platform.openai.com/signup/).
2. **Make sure you have access to the model (anyone can use gpt-3.5-turbo).**
3. (Optional) Add, remove or edit the available actions.
4. **Make sure to click save at the bottom of the page**

### Usage

1. Open a new compose window (Write, Reply or Forward).
2. Highlight some text to act one
3. Click the Aify icon in the top right (near the lightbulb) and pick an action
4. A popup will open and await the response from the API. This may take time at periods of high load.

## Tips and Tricks

You can add, edit and remove prompts from the `settings` page.

`gpt-3.5-turbo` is faster and cheaper than `gpt-4`, but not as "smart".

The prompt name (text box) is what is shown in the Aify context menu, and the prompt itself (the textarea) is prepended to the highlighted text separated by newline --- newline which makes it easy for the model to see whats what but isn't harmful if the prompt is empty.

## Building

The contents of `plugin/` should be zipped into a file ending `.xpi`.

```
cd plugin
zip -r ../aify.xpi *
```

## Todo

- [HIGH] Use the API to identify available models.
- [MOD] You should be able to specify a model name (useful for finetunings).
- [MOD] Model selection should be on a per-prompt basis.
- [LOW] Model selection should be selectable from the context menu.
- [MOD] Make it so any API could be used.
- [HIGH] Styling and UX improvements.
- [LOW] Mask API key in settings once saved.

## Privacy and Data Retention

This add-on interfaces with OpenAI's API but collects no data itself other than settings stored locally.
The text is sent to OpenAI's server and managed by their data retention policy

OpenAI's privacy policy can be found at https://openai.com/policies/privacy-policy
OpenAI's API data usage policy is here https://openai.com/policies/api-data-usage-policies

## License

GPLv3


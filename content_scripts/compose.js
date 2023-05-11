// Listen for messages from the background script
browser.runtime.onMessage.addListener((message) => {
  if (message.command === "getSelectedText") {
    return Promise.resolve(window.getSelection().toString());
  }
});

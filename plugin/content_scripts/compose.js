browser.runtime.onMessage.addListener((message) => {
  if (message.command === "getSelectedText") {
    return Promise.resolve(window.getSelection().toString());
  }
});

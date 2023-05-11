// Inject content scripts into compose windows
browser.composeScripts.register({
  js: [{file: "/content_scripts/compose.js"}]
});

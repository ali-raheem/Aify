document.addEventListener('DOMContentLoaded', function () {

  var draftContainer = document.getElementById('draft-container');

  // Load saved settings when the page is loaded
  browser.storage.local.get(['draft'], function (data) {
    var draft = data.draft;
    draftContainer.innerText = draft;
  });

});

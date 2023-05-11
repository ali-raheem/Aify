document.addEventListener('DOMContentLoaded', function () {
  // Get form elements
  var modelSelect = document.getElementById('model');
  var apiKeyInput = document.getElementById('api-key');
  var actionsContainer = document.getElementById('actions-container');
  var addActionButton = document.getElementById('add-action');
  var saveButton = document.getElementById('save-settings');
  var defaultButton = document.getElementById('default-settings');

  // Default actions
  var defaultActions = [
    { name: 'Rewrite Polite', prompt: 'Rewrite the following text to be more polite. Reply with only the re-written text and no extra comments.' },
    { name: 'Rewrite Formal', prompt: 'Rewrite the following text to be more formal. Reply with only the re-written text and no extra comments.' },
    { name: 'Classify', prompt: 'Classify the following text in terms of Politeness, Warmth, Formality, Assertiveness, Offensiveness giving a percentage for each category. Reply with only the category and score and no extra text.' },
    { name: 'Prompt provided', prompt: ' ' }
  ];
  var defaultModel = 'gpt-3.5-turbo';

  // Load saved settings when the page is loaded
  browser.storage.local.get(['model', 'apiKey', 'actions'], function (data) {
    modelSelect.value = data.model || defaultModel;
    apiKeyInput.value = data.apiKey || '';
    var actions = data.actions || defaultActions;
    actions.forEach(function (action) {
      addAction(action.name, action.prompt);
    });
  });

  // Add a new action input when the "Add Action" button is clicked
  addActionButton.addEventListener('click', function () {
    addAction('', '');
  });

  // Save settings when the "Save" button is clicked
    saveButton.addEventListener('click', function () {
        var actions = Array.from(actionsContainer.children).map(function (actionDiv) {
        var nameInput = actionDiv.querySelector('.action-name');
        var promptInput = actionDiv.querySelector('.action-prompt');
        return { name: nameInput.value, prompt: promptInput.value };
        });
        browser.storage.local.set({
        model: modelSelect.value,
        apiKey: apiKeyInput.value,
        actions: actions
        });
    });

    // Reset to default settings when the "Defaults" button is clicked
    defaultButton.addEventListener('click', function () {
        // Clear the actions container
        while (actionsContainer.firstChild) {
            actionsContainer.removeChild(actionsContainer.firstChild);
        }

        // Reset the Model and API Key
        modelSelect.value = defaultModel;
        apiKeyInput.value = '';

        // Set the actions back to default
        defaultActions.forEach(function (action) {
            addAction(action.name, action.prompt);
        });

        // Save these default settings
        browser.storage.local.set({
            model: defaultModel,
            apiKey: '',
            actions: defaultActions
        });
    });

    function addAction(name, prompt) {
        var actionDiv = document.createElement('div');
        var nameInput = document.createElement('input');
        var promptInput = document.createElement('textarea');

        nameInput.type = 'text';
        nameInput.value = name;
        promptInput.value = prompt;
       nameInput.classList.add('action-name');
       promptInput.classList.add('action-prompt');
        actionDiv.appendChild(nameInput);
        actionDiv.appendChild(promptInput);
        actionsContainer.appendChild(actionDiv);
    }
});

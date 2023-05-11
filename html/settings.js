document.addEventListener('DOMContentLoaded', function () {

  var modelSelect = document.getElementById('model');
  var apiKeyInput = document.getElementById('api-key');
  var actionsContainer = document.getElementById('actions-container');
  var addActionButton = document.getElementById('add-action');
  var saveButton = document.getElementById('save-settings');
  var defaultButton = document.getElementById('default-settings');


  var defaultActions = [
    { name: 'Rewrite Polite', prompt: 'Rewrite the following text to be more polite. Reply with only the re-written text and no extra comments.' },
    { name: 'Rewrite Formal', prompt: 'Rewrite the following text to be more formal. Reply with only the re-written text and no extra comments.' },
    { name: 'Classify', prompt: 'Classify the following text in terms of Politeness, Warmth, Formality, Assertiveness, Offensiveness giving a percentage for each category. Reply with only the category and score and no extra text.' },
    { name: 'Prompt provided', prompt: ' ' }
  ];
  var defaultModel = 'gpt-3.5-turbo';


  browser.storage.local.get(['model', 'apiKey', 'actions'], function (data) {
    modelSelect.value = data.model || defaultModel;
    apiKeyInput.value = data.apiKey || '';
    var actions = data.actions || defaultActions;
    actions.forEach(function (action) {
      addAction(action.name, action.prompt);
    });
  });


  addActionButton.addEventListener('click', function () {
    addAction('', '');
  });


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


    defaultButton.addEventListener('click', function () {

        while (actionsContainer.firstChild) {
            actionsContainer.removeChild(actionsContainer.firstChild);
        }


        modelSelect.value = defaultModel;
        apiKeyInput.value = '';


        defaultActions.forEach(function (action) {
            addAction(action.name, action.prompt);
        });


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
        var deleteButton = document.createElement('button');

        nameInput.type = 'text';
        nameInput.value = name;
        nameInput.classList.add('action-name');
        promptInput.value = prompt;
        promptInput.classList.add('action-prompt');
        deleteButton.innerText = 'Delete Prompt';
        deleteButton.classList.add('button', 'bad');

        deleteButton.addEventListener('click', function() {
            actionDiv.remove();
        });

        actionDiv.appendChild(nameInput);
        actionDiv.appendChild(promptInput);
        actionDiv.appendChild(deleteButton);
        actionsContainer.appendChild(actionDiv);
    }

});

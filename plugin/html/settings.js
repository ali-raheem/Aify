import { fetchModels } from './API.js';
import { promptVersion, defaultActions, defaultModel } from './globals.js';

const addAction = (name, prompt, actionsContainer) => {
    const actionDiv = document.createElement("div");
    const nameInput = document.createElement("input");
    const promptInput = document.createElement("textarea");
    const deleteButton = document.createElement("button");

    nameInput.type = "text";
    nameInput.value = name;
    nameInput.classList.add("action-name");

    promptInput.value = prompt;
    promptInput.classList.add("action-prompt");

    deleteButton.innerText = "Delete Prompt";
    deleteButton.classList.add("button", "bad");
    deleteButton.addEventListener("click", () => actionDiv.remove());

    const docFrag = document.createDocumentFragment();
    docFrag.appendChild(nameInput);
    docFrag.appendChild(promptInput);
    docFrag.appendChild(deleteButton);

    actionDiv.appendChild(docFrag);
    actionsContainer.appendChild(actionDiv);
};


const handleWarning = (promptUpdated, notesContainer) => {
    if (promptVersion > promptUpdated) {
        let warningContainer = document.createElement('div');
        warningContainer.id = "warning-container";
        warningContainer.classList.add('row')
        let warningDiv25 = document.createElement('div');
        warningDiv25.classList.add('col-25');
        let warningDiv75 = document.createElement('div');
        warningDiv75.classList.add('col-75');
        let warningIcon = document.createElement('img');
        warningIcon.src = "/images/warning.png";
        warningIcon.classList.add('small-icon');
        let warningText = document.createElement('span');
        warningText.innerText = "Prompts have been updated. Please backup custom prompts and click clear to load latest prompts. ";
        let ignoreButton = document.createElement('button');
        ignoreButton.classList.add('button');
        ignoreButton.classList.add('bad');
        ignoreButton.innerText = "Ignore";
        ignoreButton.addEventListener('click', function () {
            browser.storage.local.set({promptUpdated: promptVersion});
            warningContainer.parentElement.removeChild(warningContainer);
        });
        warningDiv25.innerText = "Warning "
        warningDiv25.appendChild(warningIcon);
        warningDiv75.appendChild(warningText);
        warningDiv75.appendChild(ignoreButton);
        warningContainer.appendChild(warningDiv25);
        warningContainer.appendChild(warningDiv75);
        notesContainer.appendChild(warningContainer);
    }
};

const saveSettings = (actionsContainer, modelSelect, apiKeyInput, maxTokensInput) => {
    const actions = Array.from(actionsContainer.children).map(actionDiv => {
        const nameInput = actionDiv.querySelector(".action-name");
        const promptInput = actionDiv.querySelector(".action-prompt");
        return { name: nameInput.value, prompt: promptInput.value };
    });
    
    browser.storage.local.set({
        model: modelSelect.value,
        apiKey: apiKeyInput.value,
        actions: actions,
        maxTokens: maxTokensInput.value,
        promptUpdated: promptVersion
    });
};

const setDefaultSettings = (actionsContainer, modelSelect, apiKeyInput, maxTokensInput) => {
    while (actionsContainer.firstChild) {
        actionsContainer.firstChild.remove();
    }
    modelSelect.value = defaultModel;
    apiKeyInput.value = "";
    maxTokensInput.value = 0;
    defaultActions.forEach(({ name, prompt }) => {
        addAction(name, prompt, actionsContainer);
    });
    browser.storage.local.set({
        model: defaultModel,
        apiKey: "", 
        actions: defaultActions,
        promptUpdated: promptVersion
    });
};

const getModels = async (apiKey) => {
    const responseData = await fetchModels(apiKey);
    
    var selectElement = document.getElementById("model");
    selectElement.remove(0);
    responseData.data.map(model => {
        let option = document.createElement("option");
        let selectElement = document.getElementById("model");
        option.value = model.id;
        option.text = model.id;
        selectElement.add(option);
    });
};


const addModelToSelect = (model, modelSelect) => {
    let option = document.createElement("option");
    option.value = model;
    option.text = model;
    modelSelect.add(option);
    modelSelect.value = model;
}

document.addEventListener("DOMContentLoaded", () => {
    const modelSelect = document.getElementById("model");
    const apiKeyInput = document.getElementById("api-key");
    const actionsContainer = document.getElementById("actions-container");
    const addActionButton = document.getElementById("add-action");
    const saveButton = document.getElementById("save-settings");
    const getModelsButton = document.getElementById("get-models");
    const maxTokensInput = document.getElementById("max-tokens");
    const defaultButton = document.getElementById("default-settings");
    const notesContainer = document.getElementById("notes-container");

    browser.storage.local.get(["model", "apiKey", "actions", "maxTokens", "promptUpdated"], (data) => {
        const { model = defaultModel, apiKey = '', maxTokens = 0, promptUpdated = 0, actions = defaultActions } = data;

        apiKeyInput.value = apiKey;
        addModelToSelect(model, modelSelect);
        maxTokensInput.value = maxTokens;
        handleWarning(promptUpdated, notesContainer);

        actions.forEach(({ name, prompt }) => addAction(name, prompt, actionsContainer));

        addActionButton.addEventListener("click", () => addAction("", "", actionsContainer));
        saveButton.addEventListener("click", () => saveSettings(actionsContainer, modelSelect, apiKeyInput, maxTokensInput));
        defaultButton.addEventListener("click", () => setDefaultSettings(actionsContainer, modelSelect, apiKeyInput, maxTokensInput));
        getModelsButton.addEventListener("click", () => getModels(apiKeyInput.value));
    });
});

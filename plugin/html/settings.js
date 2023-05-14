document.addEventListener("DOMContentLoaded", function () {
    var modelSelect = document.getElementById("model");
    var apiKeyInput = document.getElementById("api-key");
    var actionsContainer = document.getElementById("actions-container");
    var addActionButton = document.getElementById("add-action");
    var saveButton = document.getElementById("save-settings");
    var getModelsButton = document.getElementById("get-models");
    var maxTokensInput = document.getElementById("max-tokens");
    var defaultButton = document.getElementById("default-settings");
    var defaultActions = [
        { name: "Reply to this", prompt: "Reply to the following email." },
        { name: "Rewrite Polite", prompt: "Rewrite the following text to be more polite. Reply with only the re-written text and no extra comments." },
        { name: "Rewrite Formal", prompt: "Rewrite the following text to be more formal. Reply with only the re-written text and no extra comments." },
        { name: "Classify", prompt: "Classify the following text in terms of Politeness, Warmth, Formality, Assertiveness, Offensiveness giving a percentage for each category. Reply with only the category and score and no extra text." },
        { name: "Summerize this", prompt: "Summerize the following email into a bullet point list." },
        { name: "Translate this", prompt: "Translate the following email in English." },
        { name: "Prompt provided", prompt: " " },
    ];
    var defaultModel = "gpt-3.5-turbo";
    browser.storage.local.get(["model", "apiKey", "actions", "maxTokens"], function (data) {
        let model = data.model || defaultModel;
        apiKeyInput.value = data.apiKey || "";
	let option = document.createElement("option");
	option.value = model;
	option.text = model;
	modelSelect.add(option);
        modelSelect.value = model;
	maxTokensInput.value = data.maxTokens || 0;
        var actions = data.actions || defaultActions;
        actions.forEach(function (action) {
            addAction(action.name, action.prompt);
        });
    });
    addActionButton.addEventListener("click", function () {
        addAction("", "");
    });
    saveButton.addEventListener("click", function () {
        var actions = Array.from(actionsContainer.children).map(function (actionDiv) {
            var nameInput = actionDiv.querySelector(".action-name");
            var promptInput = actionDiv.querySelector(".action-prompt");
            return { name: nameInput.value, prompt: promptInput.value };
        });
        browser.storage.local.set({ model: modelSelect.value, apiKey: apiKeyInput.value, actions: actions, maxTokens: maxTokensInput.value });
    });
    defaultButton.addEventListener("click", function () {
        while (actionsContainer.firstChild) {
            actionsContainer.removeChild(actionsContainer.firstChild);
        }
        modelSelect.value = defaultModel;
        apiKeyInput.value = "";
	maxTokensInput.value = 0;
        defaultActions.forEach(function (action) {
            addAction(action.name, action.prompt);
        });
        browser.storage.local.set({ model: defaultModel, apiKey: "", actions: defaultActions });
    });
    getModelsButton.addEventListener("click", async function () {
	var apiKeyInput = document.getElementById("api-key");
	const response = await fetch("https://api.openai.com/v1/models", {
            method: "GET",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKeyInput.value}` },
	});
	if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
	}
	const responseData = await response.json();
	var selectElement = document.getElementById("model");
	selectElement.remove(0);
	responseData.data.map(model => {
	    let option = document.createElement("option");
	    let selectElement = document.getElementById("model");
	    option.value = model.id;
	    option.text = model.id;
	    selectElement.add(option);
	});
	getModelsButton.disabled = true;
    });

    function addAction(name, prompt) {
        var actionDiv = document.createElement("div");
        var nameInput = document.createElement("input");
        var promptInput = document.createElement("textarea");
        var deleteButton = document.createElement("button");
        nameInput.type = "text";
        nameInput.value = name;
        nameInput.classList.add("action-name");
        promptInput.value = prompt;
        promptInput.classList.add("action-prompt");
        deleteButton.innerText = "Delete Prompt";
        deleteButton.classList.add("button", "bad");
        deleteButton.addEventListener("click", function () {
            actionDiv.remove();
        });
        actionDiv.appendChild(nameInput);
        actionDiv.appendChild(promptInput);
        actionDiv.appendChild(deleteButton);
        actionsContainer.appendChild(actionDiv);
    }
});

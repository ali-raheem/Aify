import { fetchModels, fetchResponse } from './API.js';

async function regenerate(draftContainer, original, action, draftTitle) {
    const loadingIcon = document.createElement("img");
    loadingIcon.src = "/images/loading.png";
    loadingIcon.classList.add("rotate");

    draftContainer.textContent = "";
    draftContainer.appendChild(loadingIcon);

    try {
        const draft = await callBackendAPI(original, action);
        draftContainer.innerText = draft;
        document.title = draftTitle;
    } catch (error) {
        console.error(error);
        draftContainer.textContent = "Error: Unable to retrieve data";
    }
}

async function callBackendAPI(original, action) {
    const { model, apiKey, maxTokens } = await browser.storage.local.get(["model", "apiKey", "maxTokens"]);
    const response = await fetchResponse(apiKey, model, original, action, maxTokens);
    return response;
}

document.addEventListener("DOMContentLoaded", async () => {
    const regenButton = document.getElementById('regenerate');
    const draftContainer = document.getElementById("draft-container");

    const { original, action, draftTitle } = await browser.storage.local.get(["original", "action", "draftTitle"]);

    await browser.storage.local.set({ original: "", action: "", draftTitle: "" });

    regenButton.addEventListener("click", () => regenerate(draftContainer, original, action, draftTitle));
    regenerate(draftContainer, original, action, draftTitle);
});

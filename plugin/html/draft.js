import { fetchResponse } from './API.js';

async function generate(draftContainer, messages, draftTitle) {
    const loadingIcon = document.createElement("img");
    loadingIcon.src = "/images/loading.png";
    loadingIcon.classList.add("rotate");

    draftContainer.textContent = "";
    draftContainer.appendChild(loadingIcon);

    try {
        const { apiKey, model, maxTokens } = await browser.storage.local.get(
                                                ["apiKey","model", "maxTokens"]);
        const response = await fetchResponse(apiKey, model, messages, maxTokens);
        draftContainer.innerText = response;
        messages.push({role: "assistant", content: response});
        document.title = draftTitle;
        await browser.storage.local.set({messages});
    } catch (error) {
        console.error(error);
        draftContainer.textContent = "Error: Unable to retrieve data";
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const regenButton = document.getElementById('regenerate');
    const chatButton = document.getElementById('chat-button');
    const draftContainer = document.getElementById("draft-container");
    const { messages, draftTitle } = await browser.storage.local.get(["messages", "draftTitle"]);
    regenButton.addEventListener("click", () => generate(draftContainer, messages, draftTitle));
    chatButton.addEventListener("click", async () => {
        await browser.storage.local.set({messages});
        await browser.windows.create({ url: "/html/chat.html", type: "popup",
					     width: 600, height: 600 });
        window.close();
    })
    generate(draftContainer, messages, draftTitle);
    await browser.storage.local.set({ messages: "[]", draftTitle: "" });
});

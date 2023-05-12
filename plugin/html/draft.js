document.addEventListener("DOMContentLoaded", async function () {
    const draftContainer = document.getElementById("draft-container");
    const data = await browser.storage.local.get(["original", "action", "draftTitle"]);
    const original = data.original;
    const action = data.action;
    const draftTitle = data.draftTitle;
    try {
        const draft = await callBackendAPI(original, action);
        draftContainer.innerText = draft;
        document.title = draftTitle;
    } catch (error) {
        console.error(error);
        draftContainer.innerText = "Error: Unable to retrieve data";
    }
});
async function callBackendAPI(original, action) {
    const data = await browser.storage.local.get(["model", "apiKey"]);
    const model = data.model;
    const apiKey = data.apiKey;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: model, messages: [{ role: "user", content: `${action}\n---\n${original}` }] }),
    });
    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData.choices[0].message.content;
}
const promptVersion = 2;
const defaultActions = [
    { name: "Reply to this", prompt: "Reply to the following email." },
    { name: "Rewrite Polite", prompt: "Rewrite the following text to be more polite. Reply with only the re-written text and no extra comments." },
    { name: "Rewrite Formal", prompt: "Rewrite the following text to be more formal. Reply with only the re-written text and no extra comments." },
    { name: "Classify", prompt: "Classify the following text in terms of Politeness, Warmth, Formality, Assertiveness, Offensiveness giving a percentage for each category. Reply with only the category and score and no extra text." },
    { name: "Summerize this", prompt: "Summerize the following email into a bullet point list." },
    { name: "Translate this", prompt: "Translate the following email in English." },
    { name: "Prompt provided", prompt: "You are a helpful chatbot that will do their best to complete the following tasks with a single response." },
];
const defaultModel = "gpt-3.5-turbo";
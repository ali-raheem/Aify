import { fetchResponse } from './API.js';
import { chatPrompt } from './globals.js';

document.addEventListener('DOMContentLoaded', async function () {
  var messageInput = document.getElementById('message-input');
  var sendButton = document.getElementById('send-button');
 // const clearButton = document.getElementById('clear-button');
  var messagesContainer = document.getElementById('messages');
  var loadingIcon = document.createElement('img');

  loadingIcon.src = '/images/loading.png';
  loadingIcon.classList.add('rotate');

  var storage = await browser.storage.local.get(["messages"]);
    let messages = (storage.messages?.length)? storage.messages : [{role: "system",
								    content: chatPrompt}];

  messages.forEach(function(message) {
    displayMessage(message.role, message.content);
  });

  //clearButton.addEventListener('click', async () => {messages = []; await browser.storage.local.set({messages}); window.close()})
  sendButton.addEventListener('click', async function () {
    var messageText = messageInput.value.trim();

    if (messageText) {
      messages.push({role: 'user', content: messageText});
      displayMessage('user', messageText);

      sendButton.disabled = true;
      messagesContainer.appendChild(loadingIcon);
      
      try {
        const { apiKey, model, maxTokens } = await browser.storage.local.get(
                                                    ["apiKey","model", "maxTokens"]);
        const response = await fetchResponse(apiKey, model, messages, maxTokens);
       // messagesContainer.innerText = response;
        // Remove loading icon and enable button when API call finishes
       loadingIcon.parentElement.removeChild(loadingIcon);
        sendButton.disabled = false;
        
        if (response) {
          // Display the response from the model
          displayMessage('assistant', response);
          messages.push({role: 'assistant', content: response});
          
          // Save messages to local storage
          browser.storage.local.set({messages});
        }
      } catch(error) {
        console.error(error);
        messagesContainer.textContent = "Error: Unable to retrieve data";
      }

      messageInput.value = '';
    }
  });

  function displayMessage(role, text) {
    var messageDiv = document.createElement('div');
    messageDiv.classList.add(role + '-message');
    messageDiv.classList.add('message');
    messageDiv.innerText = text;
    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
});

window.addEventListener('unload', async function (event) {
    await browser.storage.local.set({ messages: "[]", draftTitle: "" });
});
  

const API_URL = "https://your-chatbot-api.vercel.app/chat"; 
const TTS_URL = "https://your-chatbot-api.vercel.app/speak"; 

async function sendMessage() {
    const inputField = document.getElementById("userInput");
    const chatbox = document.getElementById("chatbox");

    const userMessage = inputField.value;
    if (!userMessage.trim()) return;

    chatbox.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
    inputField.value = "";

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    const botMessage = data.choices[0].message.content;

    chatbox.innerHTML += `<p><strong>AI Tax Pro:</strong> ${botMessage}</p>`;
    chatbox.scrollTop = chatbox.scrollHeight;

    // Speak the response
    speak(botMessage);
}

async function speak(text) {
    const audio = new Audio(`${TTS_URL}?text=${encodeURIComponent(text)}`);
    audio.play();
}

function startVoiceInput() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById("userInput").value = transcript;
        sendMessage();
    };
}

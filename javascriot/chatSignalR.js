const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chathub")
    .build();

connection.start().then(() => {
    console.log("SignalR connected");
});

document.getElementById("sendButton").addEventListener("click", sendMessage);
document
    .getElementById("inputMessage")
    .addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

function sendMessage() {
    const userInput = document.getElementById("inputMessage").value.trim();
    document.getElementById("inputMessage").value = "";
    if (userInput !== "") {
        addUserMessage(userInput);
        connection
            .invoke("SendMessage", "User", userInput)
            .catch((err) => console.error(err));
    }
}

connection.on("ReceiveMessage", (user, message) => {
    addAIMessage(message);
});

function addUserMessage(message) {
    const chatHistory = document.getElementById("chat");
    const userMessageDiv = document.createElement("p");
    userMessageDiv.className = "chat-message__text";
    userMessageDiv.textContent = message;
    chatHistory.appendChild(userMessageDiv);
}

function addAIMessage(message) {
    const chatHistory = document.getElementById("chat");
    const aiMessageDiv = document.createElement("p");
    aiMessageDiv.className = "chat-message__text chat-message__text--AI";
    aiMessageDiv.textContent = message;
    chatHistory.appendChild(aiMessageDiv);
}

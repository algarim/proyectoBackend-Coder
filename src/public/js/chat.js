const socketClient = io();
const chatName = document.getElementById("name");
const chatForm = document.getElementById("chatForm");
const inputMessage = document.getElementById("message");
const divChat = document.getElementById("chat");

let user;

Swal.fire({
  title: "Welcome!",
  text: "What is your name?",
  input: "text",
  inputValidator: (value) => {
    if (!value) {
      return "Name is required";
    }
  },
  confirmButtonText: "Enter",
}).then((input) => {
  user = input.value;
  chatName.innerText = "Welcome, " + user;
  socketClient.emit("newUser", user);
});

socketClient.on("userConnected", (user) => {
  Toastify({
    text: `${user} has connected`,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    duration: 5000,
  }).showToast();
});

socketClient.on("connected", (messages) => {
  Toastify({
    text: "You are connected",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    duration: 5000,
  }).showToast();

  const chat = messages.map((m) => {
    return `<p>${m.user}: ${m.message}</p>`;
  })
    .join(" ");
  divChat.innerHTML = chat;
});

chatForm.onsubmit = (e) => {
  e.preventDefault();
  const infoMessage = {
    user: user,
    message: inputMessage.value,
  };
  inputMessage.value = "";
  socketClient.emit("message", infoMessage);
};

socketClient.on("chat", (newMessage) => {
  const newMessageHtml = document.createElement("p");
  newMessageHtml.innerText= `${newMessage.user}: ${newMessage.message}`;
  divChat.append(newMessageHtml);
});

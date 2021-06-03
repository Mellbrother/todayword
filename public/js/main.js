const socket = io();

document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault(); // prevents page reloading
  const messageField = document.getElementById("messageField");
  socket.emit("chat message", messageField.value);
  messageField.value = "";
});

document.getElementById("stack").addEventListener("submit", (e) => {
  e.preventDefault(); // prevents page reloading
  const stackField = document.getElementById("stackField");
  socket.emit("stack message", stackField.value);
  stackField.value = "";
});

function resetStack() {
  socket.emit("reset_stack", "");
}

function displayStack() {
  socket.emit("display_stack", "");
}

socket.on("chat message", function (msg) {
  const item = document.createElement("li");
  item.innerText = msg;
  document.getElementById("messages").appendChild(item);
});

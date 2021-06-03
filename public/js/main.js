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
  item.classList.add("text-info");
  item.innerText = msg;
  document.getElementById("messages").appendChild(item);
});

socket.on("hint message", function (msg) {
  const item = document.createElement("li");
  item.innerText = msg;
  document.getElementById("messages").appendChild(item);
});

$("#getTheme").on("click", function () {
  $("#result").text("通信中...");

  const themeNum = document.getElementById("theme_num").value;

  // Ajax通信を開始
  $.ajax({
    url: "/getTheme/?theme_num=" + themeNum,
    type: "GET",
    timeout: 5000,
  })
    .done(function (data) {
      $("#result").text("");
      document.getElementById("theme").innerHTML = "";

      for (let i = 0; i < data.length; i++) {
        const item = document.createElement("li");
        item.classList.add("list-group-item");
        item.innerText = data[i];
        document.getElementById("theme").appendChild(item);
      }
      // 通信成功時の処理を記述
    })
    .fail(function () {
      // 通信失敗時の処理を記述
    });
});

const socket = io();

// チャット送信処理
document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault(); // prevents page reloading
  const messageField = document.getElementById("messageField");
  socket.emit("chat message", messageField.value);
  messageField.value = "";
});

// ヒントのスタック処理
document.getElementById("stack").addEventListener("submit", (e) => {
  e.preventDefault(); // prevents page reloading
  const stackField = document.getElementById("stackField");
  socket.emit("stack message", stackField.value);
  stackField.value = "";
});

// スタックのリセット処理
function resetStack() {
  socket.emit("reset_stack", "");
}

// スタックしたヒントをチャット欄に写す処理
function displayStack() {
  socket.emit("display_stack", "");
}

// 参加者のチャットを受信
socket.on("chat message", function (msg) {
  const item = document.createElement("li");
  item.classList.add("text-info");
  item.innerText = msg;
  document.getElementById("messages").prepend(item);
});

// 参加者のヒント受信
socket.on("hint message", function (msg) {
  const item = document.createElement("li");
  item.innerText = msg;
  document.getElementById("messages").prepend(item);
});

// 「テーマを引く」ボタンをクリックしたときの処理
// socketにイベント通知
document.getElementById("getTheme").addEventListener("click", (e) => {
  e.preventDefault(); // prevents page reloading
  const themeNum = document.getElementById("theme_num").value;
  socket.emit("get theme", themeNum);
});

// 参加者が「テーマを引く」ボタンをクリックしたときにテーマを受信する処理
socket.on("get theme", function (data) {
  document.getElementById("theme").innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    const item = document.createElement("li");
    item.innerText = i + 1 + " : " + data[i];
    document.getElementById("theme").appendChild(item);
  }
});

// 回答者モード（ぼかしあり）
function answermode() {
  document.getElementById("main").style.filter = "blur(10px)";
  document.getElementById("messages").style.filter = "blur(10px)";
}

// 一般モード（ぼかしなし）
function defaultmode() {
  document.getElementById("main").style.filter = "";
  document.getElementById("messages").style.filter = "";
}

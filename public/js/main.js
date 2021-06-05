const socket = io();
let display_theme_num = 0;

// チャット送信処理
document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault(); // prevents page reloading
  const messageField = document.getElementById("messageField");
  if (messageField.value == "") {
    document.getElementById("empty-error").textContent =
      "空文字は送信できません。";
  } else {
    document.getElementById("empty-error").textContent = "";
    socket.emit("chat message", messageField.value);
    messageField.value = "";
  }
});

// ヒントのスタック処理
document.getElementById("stack").addEventListener("submit", (e) => {
  e.preventDefault(); // prevents page reloading
  const stackField = document.getElementById("stackField");
  if (stackField.value == "") {
    document.getElementById("empty-error").textContent =
      "空文字はスタックできません。";
  } else {
    document.getElementById("empty-error").textContent = "";
    socket.emit("stack message", stackField.value);
    stackField.value = "";
  }
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
socket.on("hint message", function (hint) {
  const div = document.createElement("div");
  div.setAttribute("id", "div-hint" + hint["key"]);
  div.setAttribute("class", "boxContainer");

  const item = document.createElement("li");
  item.setAttribute("id", "hint" + hint["key"]);
  item.setAttribute("class", "box");
  item.innerText = hint["value"];
  div.appendChild(item);

  const remove_button = document.createElement("button");
  remove_button.setAttribute("onClick", "removeHint(this.parentNode)");
  remove_button.setAttribute("class", "box btn");
  remove_button.setAttribute("value", "削除");

  const trashicon = document.createElement("i");
  trashicon.setAttribute("class", "fa fa-trash");
  remove_button.appendChild(trashicon);

  div.appendChild(remove_button);

  document.getElementById("messages").prepend(div);
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
    item.setAttribute("id", "theme-li" + i);
    item.innerText = i + 1 + " : " + data[i];
    document.getElementById("theme").appendChild(item);
  }
  display_theme_num = data.length;
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

document.getElementById("chooseTheme").addEventListener("click", (e) => {
  e.preventDefault(); // prevents page reloading
  const chosen_num = getRandomInt(display_theme_num);
  document.getElementById("theme-li" + chosen_num).style.color = "red";
});

// 0 ~ max - 1の乱数
function getRandomInt(max) {
  return Math.floor(Math.random() * max); //The maximum is exclusive and the minimum is inclusive
}

function removeHint(node) {
  // console.log(node.id);
  num = node.id.match(/\d+/);
  // console.log(num[0]);
  socket.emit("delete_chat", num[0]);
}

// ヒントの削除
socket.on("delete_chat", function (num) {
  document.getElementById("div-hint" + num).remove();
});

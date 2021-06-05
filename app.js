const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const fs = require("fs");

let stack_hint = new Map();
let theme = []; // 全体のテーマを保持
let chat_num = 0; // チャットの総数を管理

var text = fs.readFileSync("words.txt", "utf8");
var lines = text.toString().split("\n");
for (var line of lines) {
  theme.push(line);
}

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html"); //　HTMLファイルを使う
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function addHint(hint) {
  stack_hint.set(chat_num, hint);
  chat_num += 1;
}

io.on("connection", (socket) => {
  // チャット投稿イベントの受信
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  // ヒントのスタックイベントの受信
  socket.on("stack message", (msg) => {
    addHint(msg);
  });

  // スタックのリセットイベントの受信
  socket.on("reset_stack", (msg) => {
    stack_hint.clear();
  });

  // スタックの表示イベントの受信
  socket.on("display_stack", (msg) => {
    for (let [key, value] of stack_hint) {
      io.emit("hint message", {
        key: key,
        value: value,
      });
    }
    // for (let i = 0; i < stack_hint.size; i++) {
    //   io.emit("hint message", stack_hint.get(i));
    // }
  });

  // テーマを引くイベントの受信
  socket.on("get theme", (theme_num) => {
    let result = [];
    const random_set = [];

    count = 0;
    while (count < theme_num) {
      let random = getRandomInt(0, theme.length);
      if (random_set.includes(random)) {
        continue;
      }
      random_set.push(random);
      count++;
    }

    if (theme_num > theme.length) {
      res.send("Hello World");
    }

    random_set.forEach((element) => {
      result.push(theme[element]);
    });

    io.emit("get theme", result);
  });

  // チャット削除イベントの受信
  socket.on("delete_chat", (num) => {
    io.emit("delete_chat", num);
  });
});

http.listen(3000, function () {
  console.log("listening on *:3000");
});

const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const fs = require("fs");

let stack_hint = [];
let theme = [];

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

io.on("connection", (socket) => {
  // チャット投稿イベントの受信
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  // ヒントのスタックイベントの受信
  socket.on("stack message", (msg) => {
    stack_hint.push(msg);
  });

  // スタックのリセットイベントの受信
  socket.on("reset_stack", (msg) => {
    stack_hint = [];
  });

  // スタックの表示イベントの受信
  socket.on("display_stack", (msg) => {
    for (let i = 0; i < stack_hint.length; i++) {
      io.emit("hint message", stack_hint[i]);
    }
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
});

http.listen(3000, function () {
  console.log("listening on *:3000");
});

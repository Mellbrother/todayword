const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

let stack_hint = [];
let theme = [
  "カレー",
  "ラーメン",
  "ルパン",
  "コナン",
  "映画",
  "ハワイ",
  "ジャマイカ",
  "リコーダー",
  "教室",
  "サンバ",
  "プログラム",
];

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html"); //　HTMLファイルを使う
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("stack message", (msg) => {
    stack_hint.push(msg);
  });

  socket.on("reset_stack", (msg) => {
    stack_hint = [];
  });

  socket.on("display_stack", (msg) => {
    for (let i = 0; i < stack_hint.length; i++) {
      io.emit("chat message", stack_hint[i]);
    }
  });
});

http.listen(3000, function () {
  console.log("listening on *:3000");
});

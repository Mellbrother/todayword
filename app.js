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

app.get("/getTheme", function (req, res) {
  let result = [];
  // console.log(req.query.theme_num);
  // console.log(parseInt(req.query.theme_num));
  const theme_num = parseInt(req.query.theme_num);
  // console.log(theme_num);
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
  // console.log(random_set);

  random_set.forEach((element) => {
    result.push(theme[element]);
  });
  // console.log(result);
  res.send(result); //　HTMLファイルを使う
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

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
      io.emit("hint message", stack_hint[i]);
    }
  });
});

http.listen(3000, function () {
  console.log("listening on *:3000");
});

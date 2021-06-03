const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/static/html/index.html"); //　HTMLファイルを使う
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    console.log(msg);
  });
});

http.listen(3000, function () {
  console.log("listening on *:3000");
});

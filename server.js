const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Form verilerini okumak için
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Statik dosyalar (html, css)
app.use(express.static(__dirname));

// Ana sayfa → login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// LOGIN KONTROLÜ
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    res.redirect("/tasks.html");
  } else {
    res.send("Hatalı kullanıcı adı veya şifre");
  }
});

app.listen(PORT, () => {
  console.log("Sunucu çalışıyor: " + PORT);
});

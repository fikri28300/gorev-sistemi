const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// HTML, CSS, JS dosyalarını aç
app.use(express.static(__dirname));

// Ana adresi login.html'e yönlendir
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.listen(PORT, () => {
  console.log("Sunucu çalışıyor: " + PORT);
});

import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("MVEP API");
});

app.listen(4000);

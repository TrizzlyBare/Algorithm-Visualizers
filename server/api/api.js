import express from "express";

const app = express();

app.get("/api", (req, res) => {
  res.send("API is running");
});

export default app;

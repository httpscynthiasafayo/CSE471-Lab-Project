import app from "./index.js";

const PORT = process.env.PORT || 1617;
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});

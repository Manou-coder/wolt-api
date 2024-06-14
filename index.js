const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("Hello from Wolt PDF Code Extractor");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const dataBuffer = req.file.buffer;

  try {
    const data = await pdfParse(dataBuffer);
    const codeMatch = data.text.match(/CODE:\s(\w+)/);
    if (codeMatch) {
      const code = codeMatch[1];
      res.status(200).json({ code: code });
    } else {
      res.status(404).json({ error: "Code not found in PDF" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error parsing PDF" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

// For testing:
// curl -X POST -F "pdf=@/home/emmanuel/Downloads/Wolt gift card English 1.pdf" http://localhost:3000/upload

// curl -X POST -F "pdf=@/home/emmanuel/Downloads/Wolt gift card English 1.pdf" https://wolt-f3n2dc7ny-manoucoders-projects.vercel.app/upload

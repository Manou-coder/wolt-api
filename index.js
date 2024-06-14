const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("pdf"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const filePath = path.join(__dirname, req.file.path);
  const dataBuffer = fs.readFileSync(filePath);

  try {
    const data = await pdfParse(dataBuffer);
    const codeMatch = data.text.match(/CODE:\s(\w+)/);
    if (codeMatch) {
      const code = codeMatch[1];
      res.json({ code: code });
    } else {
      res.status(404).send("Code not found in PDF");
    }
  } catch (error) {
    res.status(500).send("Error parsing PDF");
  } finally {
    fs.unlinkSync(filePath); // Supprimez le fichier temporaire après traitement
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

// For testing:
// curl -X POST -F "pdf=@/home/emmanuel/Downloads/Wolt gift card English 1.pdf" http://localhost:3000/upload

// curl -X POST -F "pdf=@/home/emmanuel/Downloads/Wolt gift card English 1.pdf" https://wolt-ifp8m8vda-manoucoders-projects.vercel.app/upload

const express = require('express')
const dotenv = require('dotenv').config();
const connectDb = require('./config/dbConnection');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const app = express();
app.use(cors());

const path = require('path');

const port = 5500;
connectDb();
console.log("This is express");
app.use(express.json());
//app.use(cors({ origin: "*" }));
console.log('hi');
app.use("/api/contacts", require("./routes/contactRoute"));
app.use("/api/users", require("./routes/userRoutes"));
// app.use((req, res, next) => {
//   res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' http://localhost:5500;");

//   next();
// });
// adding on 1st dec


const upload = multer({ dest: 'uploads/' });

app.post('/api/upload', upload.single('image'), (req, res) => {
  const imagePath = req.file.path;

  // Perform OCR using Tesseract.js
  Tesseract.recognize(imagePath, 'eng')
    .then(({ data: { text } }) => {
      const contacts = parseContacts(text); // Custom function to parse contacts
      console.log('Extracted Contacts:', contacts); // Print contacts in the console
      res.json({ contacts });
    })
    .catch((err) => {
      console.error('OCR Error:', err);
      res.status(500).json({ error: 'Failed to process image' });
    });
});

// Helper function to parse contacts from OCR text
function parseContacts(text) {
  const lines = text.split('\n');
  const contacts = [];

  lines.forEach((line) => {
    if (line.trim()) {
      const parts = line.split(/[\s;,]+/).map(part => part.trim());

      // Expecting: Name, Phone, Email
      const name = parts[0] || 'N/A';
      const phone = parts[1] || 'N/A';
      const email = parts[2] || 'N/A';

      contacts.push({ name, phone, email });

      // Log each contact to console
      console.log(`Name: ${name}, Phone: ${phone}, Email: ${email}`);
    }
  });

  return contacts;
}










//ended

app.use(errorHandler);

app.listen(port, () => {
  console.log(`server ruuning on ${port}`);
});
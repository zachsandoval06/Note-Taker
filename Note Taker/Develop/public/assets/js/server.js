const express = require('express');
const path = require('path');
const fs = require('fs');

// Create an instance of an Express.js server
const app = express();

// Define a PORT for the server to listen on.
// The process.env.PORT is needed for when deploying to a hosting environment like Heroku
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve up static assets (for hosting on services like Heroku)

// API routes
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
      if (err) throw err;
      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    notes = notes.filter(note => note.id !== noteId);
    fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
      if (err) throw err;
      res.json({ok: true});
    });
  });
});

// HTML routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});

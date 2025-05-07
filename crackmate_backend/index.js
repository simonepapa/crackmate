const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors')
const app = express();
const PORT = 3000;

const db = new sqlite3.Database('database.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to SQLite DB.');
});

app.use(cors())

app.get('/scans', (req, res) => {
  const sql = 'SELECT * FROM scans';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Error while reading from DB.' });
    } else {
      res.json(rows);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
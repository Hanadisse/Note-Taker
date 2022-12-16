// imports needed
const path = require("path");
const express = require("express");
const fs = require("fs");
const notesDb = require("./db/db.json");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// at localhost:3001 return the index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// at localhost:3001/notes return the notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// this route will grab whatever is inside of the db.json file, and return it in json format
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err) => {
    if (err) {
      console.log(err);
      return;
    }
    res.json(notesDb);
  });
});

// creates variable that is set to the value of whatever comes out of createNote function
app.post("/api/notes", (req, res) => {
  const newNote = postNote(req.body, notesDb);
  res.json(newNote);
});

// this arrow function takes in the body and all of our previous notes, creates a var equal to the body, gives each note an id that is equal to the length of our arrayOfNotes, then push the new note, into the arrayOfNotes, then updates our db.json file to contain the new note, and return that new note
const postNote = (body, arrayOfNotes) => {
  const newNote = body;
  body.id = uuidv4();
  arrayOfNotes.push(newNote);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(arrayOfNotes, 2)
  );
  return newNote;
};

// calls deleteNote function passing in the id of the note that the user wants to delete
app.delete("/api/notes/:id", (req, res) => {
  deleteNote(req.params.id);
  res.json(true);
});

// function takes in the id of note to delete, loops through our db.json file, finds the note to delete, and splices that note from the array, then updated the db.json file
const deleteNote = (deletedNoteId) => {
  for (let i = 0; i < notesDb.length; i++) {
    let note = notesDb[i];
    if (note.id == deletedNoteId) {
      notesDb.splice(i, 1);
      fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(notesDb)
      );
      break;
    }
  }
};

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});

const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // Tone.Synth = monophonic. PolySynth(Tone.Synth) = lots of tone.synth's = chords
const keysPressed = {};
const noteOutput = document.getElementById("note-output")
const chordOutput = document.getElementById("chord-output");
const keyToNote = [
  ["a", "C4"],
  ["w", "C#4"],
  ["s", "D4"],
  ["e", "D#4"],
  ["d", "E4"],
  ["f", "F4"],
  ["t", "F#4"],
  ["g", "G4"],
  ["y", "G#4"],
  ["h", "A4"],
  ["u", "A#4"],
  ["j", "B4"],
  ["k", "C5"],
  ["o", "C#5"],
  ["l", "D5"],
  ["p", "D#5"],
  [";", "E5"]
];
let activeNotes = [];

const playNote = (key, note) => {
  if (!keysPressed[key]){
    synth.triggerAttack(note); // play note!
    keysPressed[key] = true;
    const keyElement = document.querySelector(`[data-key="${key}"]`); // querySelector searches html for data-key with given value
    keyElement.classList.add("active"); // adds active to class e.g. "key white active"
    activeNotes.push(note);
    chordFinder();
  }
}

const releaseNote = (key, note) => {
  if (keysPressed[key]) {
    synth.triggerRelease(note);
    keysPressed[key] = false; 
    const keyElement = document.querySelector(`[data-key="${key}"]`); // need backticks for ${variable}
    keyElement.classList.remove("active"); 
    activeNotes = activeNotes.filter((n) => n !== note);
    chordFinder();
  }
};

const chordFinder = () => {
  const detectedChords = Tonal.Chord.detect(activeNotes);
  if (detectedChords.length > 0) {
    chordOutput.textContent = `Chord: ${detectedChords.join(", ")}`;
  }
};

document.addEventListener("keydown", (e) => {
  keyToNote.forEach(([key, note]) => { // goes through each list in array. sets first element as key, second as note
    if (e.key === key) { // e.key is keyboard key pressed from "keydown".
      if (!keysPressed[key]) noteOutput.textContent += ` ${note}`; // remember backticks!
      playNote(key, note);
    }
  });
});

document.addEventListener("keyup", (e) => {
  keyToNote.forEach(([key,note]) => {
    if (e.key === key) {
      releaseNote(key,note);
    }
  });
});
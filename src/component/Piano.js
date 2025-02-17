import React from 'react';
import * as Tone from 'tone';

const Piano = () => {
  const synth = new Tone.Synth().toDestination();

  const playNote = async (note) => {
    await Tone.start(); // Ensure Tone.js is initialized
    synth.triggerAttackRelease(note, '8n');
  };

  return (
    <div>
      <h3>Piano</h3>
      <div>
        {['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'].map((note) => (
          <button key={note} onClick={() => playNote(note)}>
            {note}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Piano;
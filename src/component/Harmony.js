import React from 'react';
import * as Tone from 'tone';

const Harmony = () => {
  const synth = new Tone.PolySynth().toDestination();

  const playChord = async (chord) => {
    await Tone.start(); // Ensure Tone.js is initialized
    synth.triggerAttackRelease(chord, '2n');
  };

  return (
    <div>
      <h3>Harmony</h3>
      <div>
        {['C4 E4 G4', 'D4 F4 A4', 'E4 G4 B4'].map((chord) => (
          <button key={chord} onClick={() => playChord(chord.split(' '))}>
            {chord}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Harmony;
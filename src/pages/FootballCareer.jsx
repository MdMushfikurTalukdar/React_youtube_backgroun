import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const FootballCareer = () => {
  const { state, dispatch } = useGame();
  const [isTrainingOpen, setIsTrainingOpen] = useState(false);

  const handleTrain = (skill, value, energyCost) => {
    if (state.player.energy >= energyCost) {
      dispatch({ type: 'TRAIN_SKILL', payload: { skill, value, energyCost } });
      setIsTrainingOpen(false);
    } else {
      alert("Not enough energy to train!");
    }
  };

  const simulateWeek = () => {
    dispatch({ type: 'SIMULATE_WEEK' });
  };

  if (state.isLoading) {
    return <div>Loading your career...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Football Career</h1>
      <p>Season {state.gameWorld.currentSeason}, Week {state.gameWorld.currentWeek}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {/* Player Profile Section */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
            <h2>{state.player.name}</h2>
            <p>Age: {state.player.age} | Position: {state.player.position}</p>
            <p>Team: {state.player.team}</p>
            <hr />
            <h4>Skills:</h4>
            {state.player.skills && Object.entries(state.player.skills).map(([skill, value]) => (
              <div key={skill}>
                <span>{skill}: </span>
                <progress value={value} max="100"></progress> {value}
              </div>
            ))}
            <hr />
            <p>Energy: {state.player.energy}/100</p>
            <p>Morale: {state.player.morale}/100</p>
          </div>
          
          <button onClick={() => setIsTrainingOpen(true)} style={{ marginRight: '10px' }}>
            Open Training
          </button>
          <button onClick={simulateWeek}>
            Simulate Next Week
          </button>
        </div>

        {/* League & Game Info Section */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          <h2>League Table</h2>
          <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <p>League data will appear here once you join a team.</p>
          </div>
        </div>
      </div>

      {/* Simple Training Modal */}
      {isTrainingOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '300px'
          }}>
            <h2>Training Options</h2>
            <button onClick={() => handleTrain('shooting', 2, 10)}>
              Train Shooting (+2) - Cost: 10 Energy
            </button>
            <br />
            <button onClick={() => handleTrain('passing', 2, 10)}>
              Train Passing (+2) - Cost: 10 Energy
            </button>
            <br />
            <button onClick={() => handleTrain('stamina', 3, 15)}>
              Train Stamina (+3) - Cost: 15 Energy
            </button>
            <br />
            <button onClick={() => setIsTrainingOpen(false)} style={{ marginTop: '15px' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FootballCareer;
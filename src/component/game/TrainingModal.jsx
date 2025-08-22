import React from 'react';

const TrainingModal = ({ isOpen, onClose, onTrain }) => {
  if (!isOpen) return null;

  const trainingOptions = [
    { skill: 'shooting', name: 'Shooting', value: 2, cost: 10 },
    { skill: 'passing', name: 'Passing', value: 2, cost: 10 },
    { skill: 'dribbling', name: 'Dribbling', value: 2, cost: 10 },
    { skill: 'pace', name: 'Pace', value: 2, cost: 10 },
    { skill: 'defense', name: 'Defense', value: 2, cost: 10 },
    { skill: 'stamina', name: 'Stamina', value: 3, cost: 15 },
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '300px'
      }}>
        <h2>Training Options</h2>
        {trainingOptions.map((option) => (
          <div key={option.skill} style={{ margin: '10px 0' }}>
            <button 
              onClick={() => onTrain(option.skill, option.value, option.cost)}
              style={{ width: '100%', padding: '8px' }}
            >
              Train {option.name} (+{option.value}) - Cost: {option.cost} Energy
            </button>
          </div>
        ))}
        <button 
          onClick={onClose}
          style={{ marginTop: '15px', width: '100%', padding: '8px' }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TrainingModal;
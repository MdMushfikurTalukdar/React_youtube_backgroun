import React from 'react';

const PlayerCard = ({ player }) => {
  if (!player) return <div>Loading player data...</div>;

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
      <h2>{player.name}</h2>
      <p>Age: {player.age} | Position: {player.position}</p>
      <p>Team: {player.team}</p>
      <hr />
      <h4>Skills:</h4>
      {player.skills && Object.entries(player.skills).map(([skill, value]) => (
        <div key={skill} style={{ margin: '5px 0' }}>
          <span style={{ display: 'inline-block', width: '100px' }}>
            {skill.charAt(0).toUpperCase() + skill.slice(1)}: 
          </span>
          <progress value={value} max="100" style={{ width: '150px' }}></progress>
          <span style={{ marginLeft: '10px' }}>{value}</span>
        </div>
      ))}
      <hr />
      <p>Energy: {player.energy}/100</p>
      <p>Morale: {player.morale}/100</p>
    </div>
  );
};

export default PlayerCard;
import React from 'react';

const LeagueTable = ({ tableData }) => {
  if (!tableData || tableData.length === 0) {
    return (
      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
        <h3>League Table</h3>
        <p>No league data available. Join a team to see the standings!</p>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
      <h3>League Table</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #ccc' }}>Pos</th>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #ccc' }}>Team</th>
            <th style={{ textAlign: 'center', padding: '8px', borderBottom: '2px solid #ccc' }}>P</th>
            <th style={{ textAlign: 'center', padding: '8px', borderBottom: '2px solid #ccc' }}>W</th>
            <th style={{ textAlign: 'center', padding: '8px', borderBottom: '2px solid #ccc' }}>D</th>
            <th style={{ textAlign: 'center', padding: '8px', borderBottom: '2px solid #ccc' }}>L</th>
            <th style={{ textAlign: 'center', padding: '8px', borderBottom: '2px solid #ccc' }}>Pts</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((team, index) => (
            <tr key={team.name}>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{index + 1}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{team.name}</td>
              <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #eee' }}>{team.played}</td>
              <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #eee' }}>{team.won}</td>
              <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #eee' }}>{team.drawn}</td>
              <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #eee' }}>{team.lost}</td>
              <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeagueTable;
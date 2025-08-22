// context/GameContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial game state
const initialState = {
  player: {
    id: 1, // For future use with a DB
    name: 'Player 1',
    age: 16,
    position: 'Forward',
    team: 'Free Agent',
    skills: {
      shooting: 50,
      passing: 50,
      dribbling: 50,
      pace: 50,
      defense: 50,
      stamina: 50,
    },
    energy: 100,
    morale: 100,
  },
  club: {
    name: 'Free Agent',
    league: 'None',
    finances: 0,
    leaguePosition: 0,
  },
  gameWorld: {
    currentWeek: 1,
    currentSeason: 1,
    leagueTable: [], // This will be populated from our "database"
  },
  isLoading: true,
};

// Game reducer to handle actions (training, simulating matches, etc.)
function gameReducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA':
      // This will load data from localStorage or Google Sheets later
      return { ...state, ...action.payload, isLoading: false };
    case 'TRAIN_SKILL':
      const { skill, value, energyCost } = action.payload;
      return {
        ...state,
        player: {
          ...state.player,
          energy: state.player.energy - energyCost,
          skills: {
            ...state.player.skills,
            [skill]: Math.min(100, state.player.skills[skill] + value), // Cap skill at 100
          },
        },
      };
    case 'SIMULATE_WEEK':
      // Placeholder: This would be complex logic to simulate a week of matches
      return {
        ...state,
        gameWorld: {
          ...state.gameWorld,
          currentWeek: state.gameWorld.currentWeek + 1,
        },
        player: {
          ...state.player,
          energy: Math.min(100, state.player.energy + 30), // Recover some energy each week
        },
      };
    case 'RESET_GAME':
      return initialState;
    default:
      return state;
  }
}

// Create the Context
const GameContext = createContext();

// Context Provider Component
export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load saved game on start
  useEffect(() => {
    const savedGame = localStorage.getItem('footballCareerSave');
    if (savedGame) {
      try {
        dispatch({ type: 'LOAD_DATA', payload: JSON.parse(savedGame) });
      } catch (error) {
        console.error("Failed to load saved game:", error);
        dispatch({ type: 'LOAD_DATA', payload: initialState });
      }
    } else {
      dispatch({ type: 'LOAD_DATA', payload: initialState });
    }
  }, []);

  // Save game whenever state changes
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('footballCareerSave', JSON.stringify(state));
    }
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
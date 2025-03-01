import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import level1 from '../assets/Level1.jpg';
import { getLeaderboard } from '../queries/leaderboard'; 

function Homepage() {
  const [selectedLevel, setSelectedLevel] = useState(1);
  interface LeaderboardEntry {
    id: number;
    player_name: string;
    elapsed_seconds: number;
  }

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      const data = await getLeaderboard(selectedLevel);
      setLeaderboardData(data);
      setLoading(false);
    }
    
    fetchLeaderboard();
  }, [selectedLevel]);

  // Format time from seconds to MM:SS format
  const formatTime = (timeValue:any) => {
    // If timeValue is already a string in time format, parse it
    if (typeof timeValue === 'string') {
      // Check if it's a day format like "1 day 18:39:41.244579"
      if (timeValue.includes('day')) {
        const parts = timeValue.split(' ');
        const days = parseInt(parts[0], 10);
        const timeString = parts[2]; // The HH:MM:SS part
        const timeParts = timeString.split(':');
        
        const hours = parseInt(timeParts[0], 10) + (days * 24);
        const minutes = parseInt(timeParts[1], 10);
        const seconds = parseFloat(timeParts[2]);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${Math.floor(seconds).toString().padStart(2, '0')}`;
      }
      
      // If it's already in HH:MM:SS format
      const parts = timeValue.split(':');
      if (parts.length === 3) {
        // Just return the first two parts (minutes and seconds)
        return `${parts[0]}:${parts[1]}:${Math.floor(parseFloat(parts[2])).toString().padStart(2, '0')}`;
      }
    }
    
    // If timeValue is a number (seconds)
    if (typeof timeValue === 'number') {
      const hours = Math.floor(timeValue / 3600);
      const minutes = Math.floor((timeValue % 3600) / 60);
      const seconds = Math.floor(timeValue % 60);
      
      if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    }
    
    // Fallback if we can't parse the time
    return "00:00";
  };

  return (
    <div className='contentContainer'>
      <h1>Choose a level</h1>
      <div className="levelsContainer">
        <div className='level'>
          <Link to={`/levelone`}>
            <img 
              src={level1} 
              alt="Level 1" 
              onClick={() => setSelectedLevel(1)} 
              className={selectedLevel === 1 ? 'selected' : ''}
            />
            <p>Medium Difficulty</p>
          </Link>
        </div>
        {/* Add more levels here as needed */}
        {/* Example:
        <div className='level'>
          <Link to={`/leveltwo`}>
            <img 
              src={level2} 
              alt="Level 2" 
              onClick={() => setSelectedLevel(2)} 
              className={selectedLevel === 2 ? 'selected' : ''}
            />
            <p>Hard Difficulty</p>
          </Link>
        </div>
        */}
      </div>
      
      <div className="leaderboardContainer">
        <h2>Leaderboard - Level {selectedLevel}</h2>
        {loading ? (
          <p>Loading leaderboard...</p>
        ) : (
          <table className="leaderboard">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry, index) => (
                <tr key={entry.id}>
                  <td>{index + 1}</td>
                  <td>{entry.player_name || 'Anonymous Player'}</td>
                  <td>{formatTime(entry.elapsed_seconds)}</td>
                </tr>
              ))}
              {leaderboardData.length === 0 && (
                <tr>
                  <td colSpan={3}>No records yet. Be the first to complete this level!</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Homepage;
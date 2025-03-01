import { supabase } from "../main";
import { useState,useEffect } from "react";
import { submitLeaderboardScore } from "../queries/leaderboard";
import { useNavigate } from "react-router-dom";
import '../styles/leaderboard.scss'
interface LeaderboardFormProps {
  session: number;
}

function LeaderboardForm({ session }: LeaderboardFormProps) {
    const [playerName, setPlayerName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      if (submitted) {
        const timer = setTimeout(() => {
          navigate("/"); 
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }, [submitted, navigate]);
    
    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!playerName.trim()) return;
      
      setSubmitting(true);

      // Get the elapsed time from the completed session
      const { data, error } = await supabase
        .from('game_sessions')
        .select('elapsed_time')
        .eq('id', session)
        .single();
      
      if (error) {
        console.error('Error getting session data:', error);
        setSubmitting(false);
        return;
      }
      
      // Submit to leaderboard
      const success = await submitLeaderboardScore(
        playerName, 
        1, // level number
        data.elapsed_time
      );
      
      setSubmitting(false);
      if (success) {
        setSubmitted(true);
      }
    }
    
    if (submitted) {
      return <div className='confirmSubmissionText'>Your score has been added to the leaderboard! Redirecting to home...</div>;
    }
    
    return (
      <div className='leaderboardFormContainer'>
      
      <form onSubmit={handleSubmit}>
        <h3>Congratulations! Your time qualifies for the leaderboard.</h3>
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          maxLength={20}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Score'}
        </button>
      </form>
      </div>
    );
  }
  export default LeaderboardForm;
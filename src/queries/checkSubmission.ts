import { supabase } from "../main";

interface GameSession {
  id: number;
  level: number;
  start_time: string;

}
type GameSessionInsert = {
  level: number;
};

export async function checkSubmission(user_x: number, user_y: number, level: number, pokemonname: string) {
  try {
    const { data, error } = await supabase
      .from('correct_answers')
      .select('*')
      .eq('level', level)
      .gte('x', user_x - 50)
      .lte('x', user_x + 50)
      .gte('y', user_y - 50)
      .lte('y', user_y + 50)
      .eq('pokemonname', pokemonname.toLowerCase()); 
    
    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }
    

    return data.length > 0;
  } catch (err) {
    console.error('Error checking submission:', err);
    throw err;
  }
}


  export async function startGameSession(level: number): Promise<GameSession | null> {
    const { data, error } = await supabase
      .from("game_sessions")
      .insert<GameSessionInsert>([{ level }])
      .select()
      .single();
  
    if (error) {
      console.error("Error starting game session:", error);
      return null;
    }
    console.log('starting game session',data);
    return data;
}
export const completeLevel = async (sessionId: string) => {
  const { data: elapsed, error } = await supabase.rpc(
    'complete_session', 
    { session_id: sessionId }
  );

  if (error || !elapsed) {
    console.error("Completion failed:", error);
    return null;
  }
  return elapsed;
};

 export async function handleClick(clickedX:string, clickedY:string, currentLevel:number,pokemonname:string) {
    try {
      const isCorrect = await checkSubmission(parseFloat(clickedX), parseFloat(clickedY), currentLevel,pokemonname);
      if (isCorrect) {
        console.log("User got it correct!");
        return true;
      } else {
        console.log("User got it wrong");
        return false;
      }
    } catch (error) {
      console.error("Error processing click:", error);
    }
  }
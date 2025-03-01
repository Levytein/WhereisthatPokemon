import { supabase } from "../main"

export async function checkLeaderboardEligibility(level:number , elapsedSeconds:number){
    try{
        const {data,error} = await supabase.rpc('check_leaderboard_eligibility',{
            level_num:level,
            elapsed_time:elapsedSeconds
        });

        if(error) throw error;

        return data;
    }
    catch(err)
    {
        console.error('Error checking leaderboard eligibility' , err);
        return false;
    }
}

export async function submitLeaderboardScore(playerName: string, level: number, elapsedSeconds: number) {
    try {
        // Format as a PostgreSQL interval string
        const intervalString = `${elapsedSeconds} seconds`;
        
        const {data, error} = await supabase.rpc('submit_leaderboard_score', {
            player_name: playerName,
            level_num: level,
            elapsed_time: intervalString  // Now passing a string like "45 seconds"
        });

        if (error) throw error;
        return data;
    }
    catch(error) {
        console.error("Trouble submitting score to leaderboard", error);
    }
}

export async function getLeaderboard(level:number){
    try{
        const {data,error} = await supabase
        .from('leaderboard')
        .select('*')
        .eq('level',level)
        .order('elapsed_seconds',{ascending:true})
        .limit(50)

        if(error) throw error;
        return data;

    }
    catch(error)
    {
        console.error('Error fetching leaderboard:',error);
        return [];
    }
}
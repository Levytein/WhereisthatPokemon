/*
export default async function cleanupHandler() {
  const { data, error } = await supabase
    .from('game_sessions')
    .delete()
    .lt('start_time', new Date(Date.now() - 30 * 60 * 1000).toISOString())
    .is('finish_time', null);

  if (error) {
    console.error("Error cleaning up sessions:", error);
    return { status: 500, body: error };
  }

  console.log("Cleaned up sessions:", data);
  return { status: 200, body: data };
}*/
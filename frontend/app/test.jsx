import { supabase } from "../lib/supabaseClient";

const testConnection = async () => {
  const { data, error } = await supabase.auth.getSession();
  console.log("SESSION:", data);
  console.log("ERROR:", error);
};

testConnection();
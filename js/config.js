// Credenciales del proyecto en Supabase
const SUPABASE_URL = "https://nxzwukzmjhqlwastmsww.supabase.co";
const SUPABASE_KEY = "sb_publishable_fKf-3_q5fOBgx4KBTbUa2A_7psUKPXN";

// Inicialización del cliente global de Supabase
const dbClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

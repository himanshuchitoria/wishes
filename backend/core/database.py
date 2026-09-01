import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

# We use the service role key for the backend to bypass RLS, 
# ensuring we handle authorization logic manually in our routers.
supabase_admin: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

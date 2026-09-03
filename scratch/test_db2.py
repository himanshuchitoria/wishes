import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '../.env.local'))

from core.database import supabase_admin

try:
    res = supabase_admin.table('profiles').select('*').limit(1).execute()
    print("PROFILES:", res.data)
except Exception as e:
    print("ERROR:", str(e))

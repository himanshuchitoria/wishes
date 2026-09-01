from fastapi import APIRouter, Depends, HTTPException
from core.security import get_current_user
from core.database import supabase_admin
from pydantic import BaseModel

router = APIRouter(prefix="/api/settings", tags=["settings"])

class ProfileUpdate(BaseModel):
    display_name: str
    default_timezone: str
    default_sender_alias: str
    notify_on_delivery: bool
    notify_on_open: bool

@router.get("/")
def get_profile(user=Depends(get_current_user)):
    try:
        response = supabase_admin.table('profiles').select('*').eq('id', user.id).execute()
        if not response.data:
            # Create a default profile if it doesn't exist
            default_profile = {
                'id': user.id,
                'email': user.email,
                'display_name': user.email.split('@')[0],
                'default_timezone': 'UTC',
                'default_sender_alias': 'Anonymous',
                'notify_on_delivery': True,
                'notify_on_open': True
            }
            supabase_admin.table('profiles').insert([default_profile]).execute()
            return default_profile
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/")
def update_profile(profile: ProfileUpdate, user=Depends(get_current_user)):
    try:
        response = supabase_admin.table('profiles').update(profile.model_dump()).eq('id', user.id).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

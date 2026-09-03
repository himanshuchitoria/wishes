from fastapi import APIRouter, Depends, HTTPException
from core.security import get_current_user
from core.database import supabase_admin
from pydantic import BaseModel

router = APIRouter(prefix="/api/settings", tags=["settings"])

class ProfileUpdate(BaseModel):
    display_name: str
    default_timezone: str
    default_sender_alias: str
    default_email_prefix: str
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
                'default_email_prefix': 'roast',
                'notify_on_delivery': True,
                'notify_on_open': True
            }
            supabase_admin.table('profiles').insert([default_profile]).execute()
            return default_profile
        
        profile_data = response.data[0]
        if not profile_data.get('email'):
            profile_data['email'] = user.email
            supabase_admin.table('profiles').update({'email': user.email}).eq('id', user.id).execute()
            
        return profile_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/")
def update_profile(profile: ProfileUpdate, user=Depends(get_current_user)):
    try:
        # Update custom profiles table
        response = supabase_admin.table('profiles').update(profile.model_dump()).eq('id', user.id).execute()
        
        # Atomically sync the display_name to the Auth user's metadata so the frontend UI matches
        supabase_admin.auth.admin.update_user_by_id(
            user.id,
            user_metadata={"full_name": profile.display_name}
        )
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/account")
def delete_account(user=Depends(get_current_user)):
    try:
        # Delete group contributions for the user's wishes
        # Supabase doesn't natively support cascaded cross-table deletes via RPC without raw SQL,
        # so we fetch user's wishes and delete related group contributions manually.
        wishes = supabase_admin.table('wishes').select('id').eq('user_id', user.id).execute()
        wish_ids = [w['id'] for w in wishes.data]
        if wish_ids:
            supabase_admin.table('group_contributions').delete().in_('wish_id', wish_ids).execute()
        
        # Delete user's wishes
        supabase_admin.table('wishes').delete().eq('user_id', user.id).execute()
        
        # Delete user's profile
        supabase_admin.table('profiles').delete().eq('id', user.id).execute()
        
        # Delete the user from Supabase Auth
        supabase_admin.auth.admin.delete_user(user.id)
        
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

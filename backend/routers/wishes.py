from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from models import WishCreate
from core.security import get_current_user
from core.database import supabase_admin
import uuid
import os
import mailtrap as mt
from datetime import datetime, timezone

from core.email_templates import (
    generate_wish_email_html,
    generate_wish_email_subject,
    generate_wish_email_text,
)

def send_wish_email(wish: dict):
    token = os.getenv("MAILTRAP_API_TOKEN")
    domain = os.getenv("MAILTRAP_DOMAIN")
    if not token or not domain:
        raise Exception("Mailtrap configuration missing")
    
    sender_prefix = wish.get('sender_email_prefix', 'hello')
    sender_email = f"{sender_prefix}@{domain}"
    recipient_email = wish['recipient_email']
    sender_alias = wish.get('sender_alias') or "Someone Special"
    app_url = os.getenv("NEXT_PUBLIC_APP_URL", "https://chitoria.dev")
    reveal_url = f"{app_url}/reveal/{wish['reveal_token']}?source=email"
    
    html_body = generate_wish_email_html(wish)
    subject = generate_wish_email_subject(wish)
    plain_text = generate_wish_email_text(wish, reveal_url)
    
    client = mt.MailtrapClient(token=token)
    
    mail = mt.Mail(
        sender=mt.Address(email=sender_email, name=sender_alias),
        to=[mt.Address(email=recipient_email)],
        subject=subject,
        text=plain_text,
        html=html_body,
    )
    
    client.send(mail)



router = APIRouter(prefix="/api/wishes", tags=["wishes"])

@router.get("/")
def get_wishes(
    status: Optional[str] = Query(None),
    vibe: Optional[str] = Query(None),
    user=Depends(get_current_user)
):
    try:
        query = supabase_admin.table('wishes').select('*').eq('user_id', user.id).order('created_at', desc=True)
        if status and status != 'all':
            query = query.eq('status', status)
        if vibe and vibe != 'all':
            query = query.eq('vibe', vibe)
            
        response = query.execute()
        return {"wishes": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/")
def create_wish(wish: WishCreate, user=Depends(get_current_user)):
    try:
        # Enforce that the user can only create wishes for themselves
        wish.user_id = user.id
        wish_data = wish.model_dump()
        
        # NOTE: Ideally we dispatch to QStash here, but for MVP we just insert.
        # qstash_message_id = schedule_wish_delivery(wish_data)
        
        response = supabase_admin.table('wishes').insert([wish_data]).execute()
        return {"wish": response.data[0], "scheduled": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{wish_id}")
def delete_wish(wish_id: str, user=Depends(get_current_user)):
    try:
        # Fetch the wish and its payload
        wish_res = supabase_admin.table('wishes').select('*').eq('id', wish_id).execute()
        if not wish_res.data or wish_res.data[0]['user_id'] != user.id:
            raise HTTPException(status_code=404, detail="Wish not found or unauthorized")
        
        wish = wish_res.data[0]
        
        # Fetch associated group contributions
        contrib_res = supabase_admin.table('group_contributions').select('image_url').eq('wish_id', wish_id).execute()
        contributions = contrib_res.data or []
        
        # Collect all files to delete
        files_to_delete = []
        
        # Check main wish media
        main_media = wish.get('message_payload', {}).get('mediaUrl')
        if main_media and '/wish-media/' in main_media:
            file_path = main_media.split('/wish-media/')[1]
            files_to_delete.append(file_path)
            
        # Check contribution media
        for c in contributions:
            if c.get('image_url') and '/wish-media/' in c.get('image_url'):
                file_path = c['image_url'].split('/wish-media/')[1]
                files_to_delete.append(file_path)
                
        # Delete from storage if any
        if files_to_delete:
            supabase_admin.storage.from_('wish-media').remove(files_to_delete)
            
        # Delete group contributions (if cascade is not set)
        supabase_admin.table('group_contributions').delete().eq('wish_id', wish_id).execute()
        
        # Delete the wish itself
        response = supabase_admin.table('wishes').delete().eq('id', wish_id).execute()
        
        return {"success": True, "deleted_id": wish_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{wish_id}/deliver_now")
def deliver_now(wish_id: str, user=Depends(get_current_user)):
    try:
        # Enforce ownership and fetch all wish data
        wish_res = supabase_admin.table('wishes').select('*').eq('id', wish_id).execute()
        if not wish_res.data or wish_res.data[0]['user_id'] != user.id:
            raise HTTPException(status_code=404, detail="Wish not found or unauthorized")
            
        wish = wish_res.data[0]
        
        # Send the email! If this fails, the DB update won't run and error is propagated
        send_wish_email(wish)
        
        now = datetime.utcnow().isoformat()
        
        response = supabase_admin.table('wishes').update({
            'status': 'delivered',
            'updated_at': now
        }).eq('id', wish_id).execute()
        
        return {"success": True, "wish": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

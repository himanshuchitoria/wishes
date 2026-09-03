from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from models import WishCreate
from core.security import get_current_user
from core.database import supabase_admin
import uuid
import os
import mailtrap as mt
from datetime import datetime, timezone

def send_wish_email(wish: dict):
    token = os.getenv("MAILTRAP_API_TOKEN")
    domain = os.getenv("MAILTRAP_DOMAIN")
    if not token or not domain:
        raise Exception("Mailtrap configuration missing")
    
    sender_email = f"{wish.get('sender_email_prefix', 'hello')}@{domain}"
    recipient_email = wish['recipient_email']
    recipient_name = wish.get('recipient_name', 'there')
    app_url = os.getenv("NEXT_PUBLIC_APP_URL", "https://wishes.chitoria.dev")
    reveal_url = f"{app_url}/reveal/{wish['reveal_token']}?source=email"
    
    payload = wish.get('message_payload', {})
    theme = payload.get('theme', 'dark-ember')
    reveal_type = payload.get('revealType', 'scratch')
    sender_alias = wish.get('sender_alias') or "Someone Special"
    
    # 10 Themes matched exactly to Frontend Design Studio
    THEMES = {
        'dark-ember': {'accent1': '#f97316', 'accent2': '#ef4444', 'text': '#fdba74', 'bg': '#050505', 'card': '#0f0f11'},
        'rose-gold': {'accent1': '#f43f5e', 'accent2': '#ec4899', 'text': '#fda4af', 'bg': '#050505', 'card': '#0f0f11'},
        'neon-glitch': {'accent1': '#8b5cf6', 'accent2': '#06b6d4', 'text': '#d8b4fe', 'bg': '#050505', 'card': '#0f0f11'},
        'pastel-joy': {'accent1': '#e879f9', 'accent2': '#7dd3fc', 'text': '#f5d0fe', 'bg': '#050505', 'card': '#0f0f11'},
        'midnight-gold': {'accent1': '#f59e0b', 'accent2': '#d97706', 'text': '#fde68a', 'bg': '#050505', 'card': '#0f0f11'},
        'ocean-breeze': {'accent1': '#0ea5e9', 'accent2': '#10b981', 'text': '#bae6fd', 'bg': '#050505', 'card': '#0f0f11'},
        'velvet-noir': {'accent1': '#a855f7', 'accent2': '#7c3aed', 'text': '#d8b4fe', 'bg': '#050505', 'card': '#0f0f11'},
        'aurora-borealis': {'accent1': '#34d399', 'accent2': '#a78bfa', 'text': '#a7f3d0', 'bg': '#050505', 'card': '#0f0f11'},
        'cherry-blossom': {'accent1': '#fb7185', 'accent2': '#fda4af', 'text': '#fecdd3', 'bg': '#050505', 'card': '#0f0f11'},
        'cyber-punk': {'accent1': '#facc15', 'accent2': '#22d3ee', 'text': '#fef08a', 'bg': '#050505', 'card': '#0f0f11'},
    }
    
    tc = THEMES.get(theme, THEMES['dark-ember'])
    
    # Contextual Messaging based on Reveal Type
    REVEALS = {
        'scratch': {'icon': '🪙', 'cta': 'Scratch to Reveal', 'subject': f"🪙 A hidden message for {recipient_name}"},
        'envelope': {'icon': '✉️', 'cta': 'Break the Wax Seal', 'subject': f"✉️ A sealed letter for {recipient_name}"},
        'glitch': {'icon': '⚡', 'cta': 'Decrypt Message', 'subject': f"⚡ SYSTEM FAULT: Decrypt {recipient_name}'s birthday data"},
        'instant': {'icon': '🎉', 'cta': 'Pop the Surprise', 'subject': f"🎉 Incoming surprise for {recipient_name}!"},
    }
    rc = REVEALS.get(reveal_type, REVEALS['scratch'])
    
    client = mt.MailtrapClient(token=token)
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Happy Birthday!</title>
        <style>
            @keyframes float {{
                0% {{ transform: translateY(0px); }}
                50% {{ transform: translateY(-10px); }}
                100% {{ transform: translateY(0px); }}
            }}
            .floating-badge {{
                display: inline-block;
                animation: float 4s ease-in-out infinite;
                background: linear-gradient(135deg, {tc['accent1']}, {tc['accent2']});
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-weight: 900;
                font-size: 14px;
                letter-spacing: 2px;
                text-transform: uppercase;
                margin-bottom: 24px;
            }}
            .cta-btn {{
                display: inline-block;
                padding: 18px 48px;
                background: linear-gradient(135deg, {tc['accent1']}, {tc['accent2']});
                color: #ffffff !important;
                text-decoration: none;
                border-radius: 16px;
                font-weight: 800;
                font-size: 16px;
                letter-spacing: 0.5px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.5);
                transition: transform 0.2s;
            }}
            .cta-btn:hover {{ transform: scale(1.05); }}
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: {tc['bg']}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: {tc['bg']};">
            <tr>
                <td align="center" style="padding: 40px 16px;">
                    
                    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
                        <tr>
                            <td style="background: {tc['card']}; border: 1px solid #27272a; border-radius: 28px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0, 0.7);">
                                
                                <!-- Top vibrant bar -->
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="height: 6px; background: linear-gradient(90deg, {tc['accent1']}, {tc['accent2']}, {tc['accent1']});"></td>
                                    </tr>
                                </table>

                                <!-- Content Body -->
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding: 56px 40px 16px 40px; text-align: center;">
                                            <div class="floating-badge">
                                                {rc['icon']} SPECIAL DELIVERY {rc['icon']}
                                            </div>
                                            <h1 style="margin: 0; font-size: 42px; font-weight: 900; letter-spacing: -1px; line-height: 1.1; color: #ffffff;">
                                                Happy Birthday,<br/>{recipient_name}!
                                            </h1>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 16px 40px; text-align: center;">
                                            <p style="margin: 0 0 32px 0; font-size: 18px; color: {tc['text']}; line-height: 1.6;">
                                                A custom interactive surprise has been prepared just for you.
                                            </p>
                                            
                                            {f'''
                                            <div style="margin-bottom: 32px; border-radius: 16px; overflow: hidden; border: 1px solid #3f3f46; max-width: 300px; margin-left: auto; margin-right: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
                                                <img src="{wish['message_payload']['mediaUrl']}" alt="Birthday Photo" style="display: block; width: 100%; height: auto;" />
                                            </div>
                                            ''' if payload.get('mediaUrl') else ''}
                                        </td>
                                    </tr>

                                    <!-- Divider -->
                                    <tr>
                                        <td style="padding: 0 60px 32px 60px;">
                                            <div style="height: 1px; background: linear-gradient(90deg, transparent, #3f3f46, transparent);"></div>
                                        </td>
                                    </tr>

                                    <!-- Sender Block -->
                                    <tr>
                                        <td style="padding: 0 40px 32px 40px; text-align: center;">
                                            <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto; background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 16px 32px;">
                                                <tr>
                                                    <td style="text-align: center;">
                                                        <p style="margin: 0 0 4px 0; font-size: 11px; color: #71717a; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">
                                                            Sent with care by
                                                        </p>
                                                        <p style="margin: 0; font-size: 20px; font-weight: 800; color: {tc['text']};">
                                                            {sender_alias}
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <!-- The Button -->
                                    <tr>
                                        <td style="padding: 0 40px 56px 40px; text-align: center;">
                                            <a href="{reveal_url}" class="cta-btn">
                                                {rc['cta']} →
                                            </a>
                                            <p style="margin: 16px 0 0 0; font-size: 12px; color: #52525b;">
                                                Tap the button above to begin the {reveal_type} sequence.
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Bottom vibrant bar -->
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="height: 6px; background: linear-gradient(90deg, {tc['accent2']}, {tc['accent1']}, {tc['accent2']});"></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding: 32px 16px; text-align: center;">
                                <p style="margin: 0 0 8px 0; font-size: 13px; color: #52525b;">
                                    Designed with ✦ <span style="color: {tc['text']}; font-weight: 600;">chitoria.dev</span>
                                </p>
                                <p style="margin: 0 0 16px 0; font-size: 11px; color: #3f3f46;">
                                    Interactive Wish Engine · Midnight Delivery
                                </p>
                            </td>
                        </tr>
                    </table>

                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    
    mail = mt.Mail(
        sender=mt.Address(email=sender_email, name=sender_alias),
        to=[mt.Address(email=recipient_email)],
        subject=rc['subject'],
        text=f"Hi {recipient_name},\n\nYou have a special birthday surprise waiting for you!\n\nReveal it here: {reveal_url}\n\nSent with love by {sender_alias}\n\n— chitoria.dev",
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

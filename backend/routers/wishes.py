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
    vibe = wish.get('vibe', 'roast')
    sender_alias = wish.get('sender_alias') or "Someone Special"
    
    # Vibe-specific theming
    vibe_configs = {
        'roast': {
            'accent': '#f97316',
            'accent2': '#ef4444',
            'emoji': '🔥',
            'subject': f"🔥 Someone just roasted you for your birthday...",
            'tagline': "A birthday roast has been prepared in your honor.",
            'cta': "Reveal the Damage"
        },
        'sentimental': {
            'accent': '#f43f5e',
            'accent2': '#ec4899',
            'emoji': '💌',
            'subject': f"💌 A heartfelt birthday letter is waiting for you",
            'tagline': "Someone poured their heart out for your birthday.",
            'cta': "Open Your Letter"
        },
        'hype': {
            'accent': '#a855f7',
            'accent2': '#6366f1',
            'emoji': '🎉',
            'subject': f"🎉 You've got a birthday surprise waiting!",
            'tagline': "The party starts when you click the button.",
            'cta': "Unwrap Your Surprise"
        }
    }
    
    vc = vibe_configs.get(vibe, vibe_configs['hype'])
    
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
                0% {{ padding-top: 0px; padding-bottom: 10px; }}
                50% {{ padding-top: 10px; padding-bottom: 0px; }}
                100% {{ padding-top: 0px; padding-bottom: 10px; }}
            }}
            @keyframes pulse-glow {{
                0% {{ text-shadow: 0 0 10px rgba(244,63,94,0.4); opacity: 0.9; }}
                50% {{ text-shadow: 0 0 20px rgba(245,158,11,0.7); opacity: 1; }}
                100% {{ text-shadow: 0 0 10px rgba(244,63,94,0.4); opacity: 0.9; }}
            }}
            @keyframes sparkle {{
                0%, 100% {{ opacity: 0.4; color: #a1a1aa; }}
                50% {{ opacity: 1; color: #f59e0b; }}
            }}
            .animated-sign {{
                animation: float 4s ease-in-out infinite;
                margin-bottom: 30px;
            }}
            .text-glow {{
                animation: pulse-glow 3s ease-in-out infinite;
                background: linear-gradient(135deg, #fff, #f43f5e);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }}
            .star {{ display: inline-block; animation: sparkle 3s infinite; }}
            .star-1 {{ animation-delay: 0s; }}
            .star-2 {{ animation-delay: 1s; }}
            .star-3 {{ animation-delay: 2s; }}
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #050505; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #050505;">
            <tr>
                <td align="center" style="padding: 40px 16px;">
                    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
                        
                        <!-- Main Card -->
                        <tr>
                            <td style="background: #0f0f11; border: 1px solid #27272a; border-radius: 28px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">
                                
                                <!-- Top accent bar -->
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="height: 5px; background: linear-gradient(90deg, {vc['accent']}, {vc['accent2']}, {vc['accent']});"></td>
                                    </tr>
                                </table>

                                <!-- Inner content -->
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding: 56px 40px 16px 40px; text-align: center;">
                                            <!-- Beautiful Birthday Sign -->
                                            <div class="animated-sign">
                                                <div style="font-size: 24px; letter-spacing: 4px; margin-bottom: 12px; color: #a1a1aa; text-transform: uppercase; font-weight: 600;">
                                                    <span class="star star-1">✨</span> You've got a surprise <span class="star star-2">✨</span>
                                                </div>
                                                <h1 class="text-glow" style="margin: 0; font-size: 42px; font-weight: 900; letter-spacing: -1px; line-height: 1.1; color: #ffffff;">
                                                    Happy Birthday,<br/>{recipient_name}!
                                                </h1>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 0 40px; text-align: center;">
                                            <p style="margin: 0 0 32px 0; font-size: 16px; color: #a1a1aa; line-height: 1.6; font-style: italic;">
                                                {vc['tagline']} {vc['emoji']}
                                            </p>
                                            
                                            {f'''
                                            <div style="margin-bottom: 32px; border-radius: 16px; overflow: hidden; border: 1px solid #3f3f46; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
                                                <img src="{wish['message_payload']['mediaUrl']}" alt="Birthday Photo" style="display: block; width: 100%; max-width: 100%; height: auto;" />
                                            </div>
                                            ''' if wish.get('message_payload', {}).get('mediaUrl') else ''}
                                        </td>
                                    </tr>

                                    <!-- Decorative divider -->
                                    <tr>
                                        <td style="padding: 0 60px 32px 60px;">
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="height: 1px; background: linear-gradient(90deg, transparent, #3f3f46, transparent);"></td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <!-- From section -->
                                    <tr>
                                        <td style="padding: 0 40px 32px 40px; text-align: center;">
                                            <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                                <tr>
                                                    <td style="background: #1c1c1f; border: 1px solid #27272a; border-radius: 16px; padding: 16px 28px;">
                                                        <p style="margin: 0 0 4px 0; font-size: 11px; color: #71717a; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">
                                                            Sent with ❤️ by
                                                        </p>
                                                        <p style="margin: 0; font-size: 18px; font-weight: 700; color: {vc['accent']};">
                                                            {sender_alias}
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <!-- CTA Button -->
                                    <tr>
                                        <td style="padding: 0 40px 48px 40px; text-align: center;">
                                            <a href="{reveal_url}" style="display: inline-block; padding: 18px 48px; background: linear-gradient(135deg, {vc['accent']}, {vc['accent2']}); color: #ffffff; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 16px; letter-spacing: 0.3px; box-shadow: 0 8px 32px rgba(244, 63, 94, 0.3);">
                                                {vc['cta']} →
                                            </a>
                                            <p style="margin: 16px 0 0 0; font-size: 12px; color: #52525b;">
                                                Click the button above to open your surprise
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Bottom accent bar -->
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="height: 4px; background: linear-gradient(90deg, {vc['accent2']}, {vc['accent']}, {vc['accent2']});"></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding: 32px 16px; text-align: center;">
                                <p style="margin: 0 0 8px 0; font-size: 13px; color: #52525b;">
                                    Delivered by <span style="color: #a1a1aa; font-weight: 600;">chitoria.dev</span>
                                </p>
                                <p style="margin: 0 0 16px 0; font-size: 11px; color: #3f3f46;">
                                    AI-powered birthday wishes · Midnight precision delivery
                                </p>
                                <p style="margin: 0; font-size: 20px; letter-spacing: 4px; opacity: 0.3;">
                                    ✦ ✧ ✦
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
        subject=vc['subject'],
        text=f"Hi {recipient_name},\n\nYou have a special birthday surprise waiting for you!\n{vc['tagline']}\n\nReveal it here: {reveal_url}\n\nSent with love by {sender_alias}\n\n— chitoria.dev",
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

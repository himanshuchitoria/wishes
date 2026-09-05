import os
from html import escape

def get_reveal_cta(reveal_type: str) -> tuple[str, str]:
    """Returns (icon, cta_text) based on selected reveal type."""
    reveals = {
        'scratch': ('🪙', 'Scratch to Reveal'),
        'envelope': ('✉️', 'Break the Wax Seal & Open'),
        'glitch': ('⚡', 'Decrypt Birthday Stream'),
        'instant': ('🎉', 'Pop the Birthday Surprise'),
    }
    return reveals.get(reveal_type, reveals['scratch'])

def generate_wish_email_subject(wish: dict) -> str:
    vibe = wish.get('vibe', 'roast')
    recipient_name = escape(wish.get('recipient_name', 'Friend'))
    is_group = wish.get('is_group_board', False)
    
    if is_group:
        subjects = {
            'roast': f"🔥 {recipient_name}, your friends teamed up to roast you!",
            'sentimental': f"💌 {recipient_name}, your friends created a group birthday letter for you",
            'sweet': f"🎉 {recipient_name}, your crew built a surprise birthday board for you!",
            'snarky': f"⚡ {recipient_name}, an affectionate group reality check is waiting...",
            'custom': f"🕶️ {recipient_name}, an encrypted group dossier has been declassified",
        }
    else:
        subjects = {
            'roast': f"🔥 Warning: {recipient_name}, you have officially been roasted for your birthday!",
            'sentimental': f"💌 A heartfelt birthday letter for {recipient_name} (Open in private)",
            'sweet': f"✨ Happy Birthday, {recipient_name}! Someone made a surprise for you",
            'snarky': f"😏 Status update: {recipient_name} is officially 1 year older...",
            'custom': f"🕶️ TOP SECRET: Classified birthday dossier for {recipient_name}",
        }
    return subjects.get(vibe, subjects['roast'])

def generate_wish_email_text(wish: dict, reveal_url: str) -> str:
    recipient_name = wish.get('recipient_name', 'Friend')
    sender_alias = wish.get('sender_alias') or "Someone Special"
    vibe = wish.get('vibe', 'roast')
    _, cta_text = get_reveal_cta(wish.get('message_payload', {}).get('revealType', 'scratch'))
    
    vibe_intros = {
        'roast': f"💥 BAM! Someone who knows you too well has prepared an unfiltered birthday roast.",
        'sentimental': f"💌 A deeply personal, heartfelt birthday message has been crafted and sealed just for you.",
        'sweet': f"✨ Happy Birthday! An unforgettable interactive surprise is waiting to celebrate your big day.",
        'snarky': f"😏 Another year wiser? Statistically unproven. But your birthday surprise has arrived.",
        'custom': f"🕶️ A classified digital time-capsule has been securely routed to your coordinates.",
    }
    
    intro = vibe_intros.get(vibe, vibe_intros['roast'])
    
    return f"""Hi {recipient_name},

{intro}

{cta_text} here:
{reveal_url}

Sent with care by: {sender_alias}

— Delivered via chitoria.dev (Hyper-Personalized AI Birthday Engine)
"""

def generate_wish_email_html(wish: dict) -> str:
    vibe = wish.get('vibe', 'roast')
    recipient_name = escape(wish.get('recipient_name', 'Friend'))
    sender_alias = escape(wish.get('sender_alias') or "Someone Special")
    app_url = os.getenv("NEXT_PUBLIC_APP_URL", "https://chitoria.dev")
    reveal_url = f"{app_url}/reveal/{wish['reveal_token']}?source=email"
    
    payload = wish.get('message_payload', {}) or {}
    reveal_type = payload.get('revealType', 'scratch')
    media_url = payload.get('mediaUrl')
    custom_headline = payload.get('headline')
    is_group = wish.get('is_group_board', False)
    
    icon, cta_action = get_reveal_cta(reveal_type)
    
    # -------------------------------------------------------------------------
    # 1. ROAST (Extreme Comic Pop-Art, Massive Bold Text)
    # -------------------------------------------------------------------------
    if vibe == 'roast':
        headline_text = escape(custom_headline) if custom_headline else f"YOU GOT ROASTED!"
        
        media_html = f"""
        <tr>
            <td align="center" style="padding: 20px;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="background: #000; padding: 8px; transform: rotate(2deg);">
                    <tr>
                        <td>
                            <img src="{media_url}" alt="Target" style="display: block; width: 100%; max-width: 400px; border: 4px solid #FFF;" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        """ if media_url else ""
        
        return f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #F43F5E; font-family: 'Arial Black', Impact, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F43F5E; padding: 40px 10px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background: #FFEB3B; border: 8px solid #000000; box-shadow: 16px 16px 0px #000000;">
                    
                    <tr>
                        <td align="center" style="padding: 40px 20px 0 20px;">
                            <div style="background: #000; color: #FFF; display: inline-block; padding: 10px 20px; font-size: 24px; text-transform: uppercase; letter-spacing: 4px; transform: skewX(-10deg);">
                                ⚠️ INCOMING STRIKE
                            </div>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center" style="padding: 20px;">
                            <h1 style="margin: 0; font-size: 72px; line-height: 0.9; color: #000; text-transform: uppercase; text-shadow: 4px 4px 0px #06B6D4;">
                                {headline_text}
                            </h1>
                        </td>
                    </tr>
                    
                    {media_html}
                    
                    <tr>
                        <td align="center" style="padding: 20px 40px;">
                            <p style="margin: 0; font-size: 24px; font-family: Arial, sans-serif; font-weight: 900; line-height: 1.4; color: #000; border: 4px dashed #000; padding: 20px; background: #FFF;">
                                {recipient_name.upper()}, someone decided your ego needed a reality check for your birthday. 💥
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center" style="padding: 20px 20px 60px 20px;">
                            <a href="{reveal_url}" style="display: inline-block; background: #06B6D4; color: #000; border: 6px solid #000; box-shadow: 10px 10px 0px #000; padding: 20px 40px; font-size: 28px; text-decoration: none; text-transform: uppercase;">
                                {icon} {cta_action}
                            </a>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>"""

    # -------------------------------------------------------------------------
    # 2. SWEET (Cosmic Neon, Image behind Large Glowing Text)
    # -------------------------------------------------------------------------
    elif vibe == 'sweet':
        headline_text = escape(custom_headline) if custom_headline else f"COSMIC VIBES"
        
        # We use a background color, but if a media_url is provided, we use it as a massive background behind the text!
        bg_attr = f'background="{media_url}"' if media_url else ''
        bg_style = f"background-color: #0B001A; background-image: url('{media_url}'); background-size: cover; background-position: center;" if media_url else "background-color: #0B001A;"
        
        return f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #05000A; font-family: 'Trebuchet MS', Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #05000A; padding: 40px 10px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; border: 4px solid #00FFFF; box-shadow: 0 0 40px #00FFFF, 0 0 10px #00FFFF inset; border-radius: 20px; overflow: hidden;">
                    
                    <!-- Hero Section with potentially Image Behind Text -->
                    <tr>
                        <td align="center" {bg_attr} style="{bg_style} padding: 80px 20px; text-align: center;">
                            <div style="background: rgba(11, 0, 26, 0.6); padding: 40px 20px; border-radius: 20px; border: 2px solid #FF00FF; box-shadow: 0 0 30px #FF00FF;">
                                <p style="margin: 0 0 10px 0; color: #00FFFF; font-size: 18px; letter-spacing: 6px; text-transform: uppercase; text-shadow: 0 0 10px #00FFFF;">
                                    ✨ {recipient_name} ✨
                                </p>
                                <h1 style="margin: 0; font-size: 64px; color: #FFF; text-transform: uppercase; line-height: 1.1; text-shadow: 0 0 20px #FF00FF, 0 0 40px #FF00FF, 0 0 60px #FF00FF;">
                                    {headline_text}
                                </h1>
                            </div>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center" style="background: #0B001A; padding: 40px 30px;">
                            <p style="margin: 0 0 40px 0; font-size: 20px; color: #E0B0FF; line-height: 1.6; text-shadow: 0 0 5px #E0B0FF;">
                                A highly immersive, neon-infused celebration has been forged in the cosmos specifically for you.
                            </p>
                            
                            <a href="{reveal_url}" style="display: inline-block; background: transparent; color: #00FFFF; border: 3px solid #00FFFF; box-shadow: 0 0 15px #00FFFF, inset 0 0 15px #00FFFF; padding: 18px 40px; font-size: 20px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; border-radius: 50px;">
                                {icon} {cta_action}
                            </a>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center" style="background: #05000A; padding: 20px; border-top: 1px solid #FF00FF;">
                            <p style="margin: 0; color: #FF00FF; font-size: 14px; letter-spacing: 2px; text-shadow: 0 0 5px #FF00FF;">
                                TRANSMITTED BY: {sender_alias.upper()}
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>"""

    # -------------------------------------------------------------------------
    # 3. SENTIMENTAL (Sleek, Classy Editorial, Massive Serif Text)
    # -------------------------------------------------------------------------
    elif vibe == 'sentimental':
        headline_text = escape(custom_headline) if custom_headline else f"Happy Birthday."
        
        media_html = f"""
        <tr>
            <td align="center" style="padding: 0 0 40px 0;">
                <img src="{media_url}" alt="Memory" style="display: block; width: 100%; max-width: 500px; filter: grayscale(20%);" />
            </td>
        </tr>
        """ if media_url else ""
        
        return f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #E8E5E1; font-family: 'Times New Roman', Times, serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #E8E5E1; padding: 40px 10px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background: #F4F1ED; border: 1px solid #D1CDC7;">
                    
                    <tr>
                        <td align="center" style="padding: 60px 20px 20px 20px;">
                            <p style="margin: 0; font-size: 14px; letter-spacing: 10px; text-transform: uppercase; color: #8A8580;">
                                VOLUME 01 / {recipient_name.upper()}
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center" style="padding: 0 20px 40px 20px;">
                            <h1 style="margin: 0; font-size: 80px; font-weight: normal; font-style: italic; color: #2C2A28; line-height: 1;">
                                {headline_text}
                            </h1>
                        </td>
                    </tr>
                    
                    {media_html}
                    
                    <tr>
                        <td align="center" style="padding: 0 60px 40px 60px;">
                            <div style="border-top: 1px solid #2C2A28; border-bottom: 1px solid #2C2A28; padding: 30px 0;">
                                <p style="margin: 0; font-size: 18px; color: #2C2A28; line-height: 1.8; font-family: Arial, sans-serif;">
                                    An editorial collection of thoughts, memories, and well-wishes curated beautifully for your special day.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center" style="padding: 0 20px 60px 20px;">
                            <a href="{reveal_url}" style="display: inline-block; background: #2C2A28; color: #F4F1ED; padding: 18px 40px; font-size: 16px; font-family: Arial, sans-serif; letter-spacing: 3px; text-decoration: none; text-transform: uppercase;">
                                {icon} {cta_action}
                            </a>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center" style="padding: 30px 20px; background: #2C2A28;">
                            <p style="margin: 0; color: #F4F1ED; font-size: 12px; font-family: Arial, sans-serif; letter-spacing: 4px; text-transform: uppercase;">
                                FROM: {sender_alias}
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>"""

    # -------------------------------------------------------------------------
    # 4. SNARKY (Cyberpunk Glitch, Neon Green on Black, Terminal)
    # -------------------------------------------------------------------------
    elif vibe == 'snarky':
        headline_text = escape(custom_headline) if custom_headline else f"ERROR: AGE INCREASED"
        
        media_html = f"""
        <tr>
            <td align="center" style="padding: 20px;">
                <div style="border: 2px solid #39FF14; display: inline-block; padding: 4px;">
                    <img src="{media_url}" alt="Subject" style="display: block; max-width: 100%; filter: contrast(150%) sepia(100%) hue-rotate(50deg);" />
                </div>
            </td>
        </tr>
        """ if media_url else ""
        
        return f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Courier New', Courier, monospace;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 10px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; border: 4px solid #39FF14; box-shadow: 8px 8px 0px #39FF14;">
                    
                    <tr>
                        <td style="background: #39FF14; padding: 10px 20px;">
                            <p style="margin: 0; font-size: 18px; color: #000; font-weight: bold;">
                                > ROOT_ACCESS // CHITORIA_SYS
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="left" style="padding: 40px 30px;">
                            <h1 style="margin: 0 0 20px 0; font-size: 48px; color: #39FF14; text-transform: uppercase; line-height: 1;">
                                {headline_text}
                            </h1>
                            <p style="margin: 0 0 10px 0; font-size: 18px; color: #FFF;">
                                > TARGET: {recipient_name.upper()}
                            </p>
                            <p style="margin: 0; font-size: 16px; color: #AAA; line-height: 1.5;">
                                > DIAGNOSTIC: Biological degradation confirmed. You are officially one year older. We have compiled a file of sarcastic remarks for your viewing displeasure.
                            </p>
                        </td>
                    </tr>
                    
                    {media_html}
                    
                    <tr>
                        <td align="center" style="padding: 20px 20px 40px 20px;">
                            <a href="{reveal_url}" style="display: inline-block; background: transparent; color: #39FF14; border: 2px dashed #39FF14; padding: 20px 40px; font-size: 24px; font-weight: bold; text-decoration: none; text-transform: uppercase;">
                                > {icon} {cta_action} _
                            </a>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>"""

    # -------------------------------------------------------------------------
    # 5. CUSTOM (High Contrast, Bold Artistic Neo-Brutalist)
    # -------------------------------------------------------------------------
    else:  
        headline_text = escape(custom_headline) if custom_headline else f"OPEN IMMEDIATELY."
        
        media_html = f"""
        <tr>
            <td align="center" style="padding: 20px;">
                <img src="{media_url}" alt="Attachment" style="display: block; max-width: 100%; border: 8px solid #000;" />
            </td>
        </tr>
        """ if media_url else ""
        
        return f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #FFFFFF; font-family: Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; padding: 40px 10px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background: #000; border: 10px solid #000;">
                    
                    <tr>
                        <td align="center" style="background: #FFF; padding: 60px 20px;">
                            <h1 style="margin: 0; font-size: 64px; color: #000; text-transform: uppercase; letter-spacing: -2px; line-height: 0.9;">
                                {headline_text}
                            </h1>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center" style="background: #000; padding: 40px 20px;">
                            <p style="margin: 0; font-size: 24px; color: #FFF; font-weight: bold; text-transform: uppercase;">
                                TO: {recipient_name}
                            </p>
                        </td>
                    </tr>
                    
                    {media_html}
                    
                    <tr>
                        <td align="center" style="background: #FFF; padding: 40px 20px;">
                            <a href="{reveal_url}" style="display: inline-block; background: #000; color: #FFF; border: 4px solid #000; padding: 20px 40px; font-size: 24px; font-weight: 900; text-decoration: none; text-transform: uppercase;">
                                {icon} {cta_action}
                            </a>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center" style="background: #FFF; padding: 0 20px 20px 20px;">
                            <p style="margin: 0; font-size: 14px; font-weight: bold; color: #000; text-transform: uppercase;">
                                SENDER: {sender_alias}
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>"""

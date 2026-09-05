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
    # 1. ROAST (Neo-Brutalist Comic Pop-Art)
    # -------------------------------------------------------------------------
    if vibe == 'roast':
        headline_text = escape(custom_headline) if custom_headline else f"HAPPY BIRTHDAY, {recipient_name.upper()}!"
        media_block = f"""
        <tr>
            <td align="center" style="padding: 16px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="background: #ffffff; border: 3px solid #000000; box-shadow: 6px 6px 0px #000000; max-width: 320px; width: 100%; transform: rotate(-1deg);">
                    <tr>
                        <td style="padding: 12px; background: #ffffff;">
                            <img src="{media_url}" alt="Exhibit A" style="display: block; width: 100%; height: auto; border: 2px solid #000000;" />
                            <p style="margin: 8px 0 0 0; font-family: monospace; font-size: 11px; font-weight: bold; text-align: center; color: #000000;">[ EXHIBIT A: TARGET PHOTO ]</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        """ if media_url else ""
        
        group_badge = """
        <tr>
            <td align="center" style="padding: 0 24px 16px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="background: #a855f7; border: 2px solid #000000; box-shadow: 3px 3px 0px #000000;">
                    <tr>
                        <td style="padding: 6px 14px; font-family: 'Arial Black', Impact, sans-serif; font-size: 11px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">
                            👥 MULTI-FRIEND COLLABORATIVE ROAST DETONATION
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        """ if is_group else ""
        
        return f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You Have Been Roasted!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FEF08A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #FEF08A; padding: 32px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background: #ffffff; border: 4px solid #000000; box-shadow: 8px 8px 0px #000000;">
                    
                    <!-- Comic Header Bar -->
                    <tr>
                        <td style="background: #F97316; border-bottom: 4px solid #000000; padding: 14px 20px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="left">
                                        <span style="display: inline-block; background: #FFEB3B; border: 2px solid #000000; box-shadow: 2px 2px 0px #000000; padding: 3px 8px; font-family: 'Arial Black', Impact, sans-serif; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: #000000;">
                                            ISSUE #1: THE UNFILTERED ROAST
                                        </span>
                                    </td>
                                    <td align="right">
                                        <span style="font-family: monospace; font-size: 11px; font-weight: 900; color: #ffffff; background: #000000; padding: 2px 6px;">
                                            CHITORIA.DEV
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Big Callout Boom -->
                    <tr>
                        <td align="center" style="padding: 36px 24px 16px 24px;">
                            <div style="display: inline-block; background: #F43F5E; color: #ffffff; border: 3px solid #000000; box-shadow: 4px 4px 0px #000000; padding: 6px 16px; font-family: 'Arial Black', Impact, sans-serif; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; transform: rotate(-2deg); margin-bottom: 20px;">
                                💥 BOOM! BRACE YOUR EGO 💥
                            </div>
                            <h1 style="margin: 0 0 12px 0; font-family: 'Arial Black', Impact, -apple-system, sans-serif; font-size: 40px; line-height: 0.95; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; color: #000000;">
                                {headline_text}
                            </h1>
                            <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333333; line-height: 1.5;">
                                A hyper-personalized pop-art roast has been scheduled for your birthday. Someone who knows all your quirks made sure it stings with love.
                            </p>
                        </td>
                    </tr>
                    
                    {group_badge}
                    {media_block}

                    <!-- Warning Teaser Box -->
                    <tr>
                        <td align="center" style="padding: 12px 24px 28px 24px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #FEF9C3; border: 3px dashed #000000; padding: 18px;">
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0 0 4px 0; font-family: monospace; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #dc2626; letter-spacing: 1.5px;">
                                            [ CONFIDENTIAL ROAST SUMMARY ]
                                        </p>
                                        <p style="margin: 0; font-size: 16px; font-weight: 800; color: #000000; line-height: 1.4;">
                                            "{recipient_name}, scientists confirm you are officially too old to ever be considered a child prodigy. Click below to face the music."
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Big Call To Action Button -->
                    <tr>
                        <td align="center" style="padding: 0 24px 32px 24px;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="background: #06B6D4; border: 4px solid #000000; box-shadow: 6px 6px 0px #000000;">
                                        <a href="{reveal_url}" target="_blank" style="display: block; padding: 18px 36px; font-family: 'Arial Black', Impact, sans-serif; font-size: 18px; font-weight: 900; color: #ffffff; text-decoration: none; text-transform: uppercase; letter-spacing: 1.5px;">
                                            {icon} {cta_action.upper()} (IF YOU DARE) →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 12px 0 0 0; font-size: 12px; font-weight: 800; color: #71717a; text-transform: uppercase; font-family: monospace;">
                                ⚡ Sequence ready · No registration required
                            </p>
                        </td>
                    </tr>

                    <!-- Sender Footer Tag -->
                    <tr>
                        <td style="background: #F4F4F5; border-top: 3px solid #000000; padding: 18px 24px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="left">
                                        <span style="font-family: monospace; font-size: 10px; font-weight: 900; color: #71717a; text-transform: uppercase;">
                                            CONSPIRACY COORDINATOR:
                                        </span>
                                        <br/>
                                        <span style="font-family: 'Arial Black', sans-serif; font-size: 15px; font-weight: 900; color: #000000;">
                                            {sender_alias}
                                        </span>
                                    </td>
                                    <td align="right">
                                        <span style="display: inline-block; background: #FFEB3B; border: 2px solid #000000; box-shadow: 2px 2px 0px #000000; padding: 4px 8px; font-family: monospace; font-size: 10px; font-weight: 900; color: #000000;">
                                            100% UNFILTERED
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>

                <!-- Bottom Branding -->
                <p style="margin: 20px 0 0 0; font-family: monospace; font-size: 11px; font-weight: bold; color: #71717a; text-transform: uppercase;">
                    Delivered via <a href="{app_url}" style="color: #000000; font-weight: 900; text-decoration: underline;">chitoria.dev</a> · Hyper-Personalized AI Wishes
                </p>
            </td>
        </tr>
    </table>
</body>
</html>"""

    # -------------------------------------------------------------------------
    # 2. SENTIMENTAL (Warm Editorial, Heartfelt Letter & Wax Seal)
    # -------------------------------------------------------------------------
    elif vibe == 'sentimental':
        headline_text = escape(custom_headline) if custom_headline else f"Dearest {recipient_name},"
        media_block = f"""
        <tr>
            <td align="center" style="padding: 16px 36px;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="background: #ffffff; border: 1px solid #E5DCD1; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); max-width: 320px; width: 100%;">
                    <tr>
                        <td style="padding: 10px;">
                            <img src="{media_url}" alt="Memory" style="display: block; width: 100%; height: auto; border-radius: 8px;" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        """ if media_url else ""
        
        group_badge = """
        <tr>
            <td align="center" style="padding: 0 36px 16px 36px;">
                <div style="display: inline-block; background: #FFF1F2; border: 1px solid #FECDD3; border-radius: 9999px; padding: 6px 18px; font-family: Georgia, serif; font-size: 12px; color: #E11D48; font-style: italic;">
                    💌 A collaborative memory board filled with love and notes from your closest circle.
                </div>
            </td>
        </tr>
        """ if is_group else ""

        return f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>A Heartfelt Letter for You</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F4EF; font-family: Georgia, 'Playfair Display', Garamond, 'Times New Roman', serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F7F4EF; padding: 36px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="580" cellpadding="0" cellspacing="0" style="max-width: 580px; width: 100%; background: #ffffff; border: 1px solid #E7DFD5; border-radius: 16px; box-shadow: 0 10px 35px rgba(90, 70, 50, 0.08); overflow: hidden;">
                    
                    <!-- Wax Ribbon Accent -->
                    <tr>
                        <td style="height: 4px; background: linear-gradient(90deg, #F43F5E, #FB7185, #F43F5E);"></td>
                    </tr>

                    <!-- Letter Header -->
                    <tr>
                        <td align="center" style="padding: 40px 36px 16px 36px;">
                            <div style="font-size: 32px; margin-bottom: 12px;">💌</div>
                            <p style="margin: 0 0 8px 0; font-family: Georgia, serif; font-size: 13px; font-style: italic; color: #E11D48; letter-spacing: 1px;">
                                A private letter for your birthday
                            </p>
                            <h1 style="margin: 0 0 16px 0; font-family: Georgia, 'Playfair Display', serif; font-size: 34px; font-weight: normal; color: #1C1917; line-height: 1.2;">
                                {headline_text}
                            </h1>
                            <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; color: #78716C; line-height: 1.6;">
                                Looking back on everything, you are someone who makes the world infinitely warmer. An intimate digital time-capsule has been sealed with words written just for you.
                            </p>
                        </td>
                    </tr>

                    {group_badge}
                    {media_block}

                    <!-- Letter Quote Box -->
                    <tr>
                        <td align="center" style="padding: 12px 36px 28px 36px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #FAF7F2; border-left: 3px solid #E11D48; border-radius: 4px; padding: 20px 24px;">
                                <tr>
                                    <td>
                                        <p style="margin: 0; font-family: Georgia, serif; font-size: 17px; font-style: italic; color: #44403C; line-height: 1.6;">
                                            "Thank you for being the person who shows up, who cares deeply, and whose presence is a gift in itself. Open this letter when you have a quiet moment."
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Button -->
                    <tr>
                        <td align="center" style="padding: 0 36px 36px 36px;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="background: #E11D48; border-radius: 9999px; box-shadow: 0 4px 18px rgba(225, 29, 72, 0.35);">
                                        <a href="{reveal_url}" target="_blank" style="display: block; padding: 16px 36px; font-family: Georgia, serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; letter-spacing: 0.5px;">
                                            {icon} {cta_action} →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Signature Footer -->
                    <tr>
                        <td style="background: #FAF7F2; border-top: 1px solid #E7DFD5; padding: 24px 36px; text-align: center;">
                            <p style="margin: 0 0 4px 0; font-family: Georgia, serif; font-size: 13px; font-style: italic; color: #78716C;">
                                Written with love and cherished by
                            </p>
                            <p style="margin: 0; font-family: Georgia, serif; font-size: 18px; font-weight: bold; color: #1C1917;">
                                {sender_alias}
                            </p>
                        </td>
                    </tr>

                </table>

                <p style="margin: 20px 0 0 0; font-family: Georgia, serif; font-size: 12px; font-style: italic; color: #A8A29E;">
                    Delivered with care via <a href="{app_url}" style="color: #78716C; text-decoration: none;">chitoria.dev</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>"""

    # -------------------------------------------------------------------------
    # 3. SWEET (Cosmic Royal Purple, Celebration Glow & Confetti)
    # -------------------------------------------------------------------------
    elif vibe == 'sweet':
        headline_text = escape(custom_headline) if custom_headline else f"Happy Birthday, {recipient_name}! 🎂"
        media_block = f"""
        <tr>
            <td align="center" style="padding: 16px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="background: #3B0764; border: 2px solid #C084FC; border-radius: 16px; max-width: 320px; width: 100%; box-shadow: 0 8px 30px rgba(192, 132, 252, 0.3);">
                    <tr>
                        <td style="padding: 10px;">
                            <img src="{media_url}" alt="Birthday Snapshot" style="display: block; width: 100%; height: auto; border-radius: 12px;" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        """ if media_url else ""
        
        group_badge = """
        <tr>
            <td align="center" style="padding: 0 32px 16px 32px;">
                <div style="display: inline-block; background: rgba(236, 72, 153, 0.2); border: 1px solid #EC4899; border-radius: 9999px; padding: 6px 16px; font-size: 12px; font-weight: bold; color: #F472B6;">
                    🎉 SURPRISE GROUP CELEBRATION BOARD ATTACHED
                </div>
            </td>
        </tr>
        """ if is_group else ""

        return f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Birthday Celebration Surprise!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #1E0B36; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #1E0B36; padding: 36px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="580" cellpadding="0" cellspacing="0" style="max-width: 580px; width: 100%; background: #2E1065; border: 2px solid #A855F7; border-radius: 24px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6); overflow: hidden;">
                    
                    <!-- Top Rainbow Sparkle Bar -->
                    <tr>
                        <td style="height: 6px; background: linear-gradient(90deg, #EC4899, #8B5CF6, #06B6D4, #EAB308);"></td>
                    </tr>

                    <!-- Content Header -->
                    <tr>
                        <td align="center" style="padding: 40px 32px 16px 32px;">
                            <div style="display: inline-block; background: linear-gradient(135deg, #EC4899, #F59E0B); color: #ffffff; border-radius: 9999px; padding: 6px 16px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 20px; box-shadow: 0 4px 14px rgba(236, 72, 153, 0.4);">
                                ✨ INCOMING BIRTHDAY SURPRISE ✨
                            </div>
                            <h1 style="margin: 0 0 12px 0; font-size: 38px; font-weight: 900; color: #ffffff; line-height: 1.1; letter-spacing: -0.5px;">
                                {headline_text}
                            </h1>
                            <p style="margin: 0; font-size: 16px; color: #E9D5FF; line-height: 1.6;">
                                An unforgettable interactive birthday experience has been custom built to celebrate you today. Filled with great music, good vibes, and memorable surprises!
                            </p>
                        </td>
                    </tr>

                    {group_badge}
                    {media_block}

                    <!-- Button -->
                    <tr>
                        <td align="center" style="padding: 16px 32px 36px 32px;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="background: linear-gradient(135deg, #EC4899, #F59E0B); border-radius: 14px; box-shadow: 0 8px 25px rgba(236, 72, 153, 0.45);">
                                        <a href="{reveal_url}" target="_blank" style="display: block; padding: 18px 36px; font-size: 17px; font-weight: 800; color: #ffffff; text-decoration: none; letter-spacing: 0.5px;">
                                            {icon} {cta_action} 🎉
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Sender Footer -->
                    <tr>
                        <td style="background: #1F073E; border-top: 1px solid #4C1D95; padding: 20px 32px; text-align: center;">
                            <p style="margin: 0 0 4px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #A855F7; font-weight: 700;">
                                Created with pure love by
                            </p>
                            <p style="margin: 0; font-size: 18px; font-weight: 800; color: #F0ABFC;">
                                {sender_alias}
                            </p>
                        </td>
                    </tr>

                </table>

                <p style="margin: 20px 0 0 0; font-size: 11px; color: #A855F7;">
                    Delivered via <a href="{app_url}" style="color: #F472B6; font-weight: bold; text-decoration: none;">chitoria.dev</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>"""

    # -------------------------------------------------------------------------
    # 4. SNARKY (Cyber Terminal & Glitch Monospace)
    # -------------------------------------------------------------------------
    elif vibe == 'snarky':
        headline_text = escape(custom_headline) if custom_headline else f"> HAPPY BIRTHDAY, {recipient_name.upper()}"
        media_block = f"""
        <tr>
            <td align="center" style="padding: 16px 28px;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="background: #09090B; border: 1px solid #06B6D4; max-width: 320px; width: 100%;">
                    <tr>
                        <td style="padding: 8px;">
                            <img src="{media_url}" alt="Target Subject" style="display: block; width: 100%; height: auto;" />
                            <p style="margin: 6px 0 0 0; font-family: monospace; font-size: 10px; color: #06B6D4;">// TARGET_ID: {recipient_name.upper()}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        """ if media_url else ""
        
        group_badge = """
        <tr>
            <td align="center" style="padding: 0 28px 16px 28px;">
                <div style="background: #083344; border: 1px solid #06B6D4; padding: 4px 12px; font-family: 'Courier New', monospace; font-size: 11px; color: #22D3EE;">
                    [ MULTI_NODE_DATA ]: Several associates added sarcastic tributes.
                </div>
            </td>
        </tr>
        """ if is_group else ""

        return f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Birthday Anomaly Detected</title>
</head>
<body style="margin: 0; padding: 0; background-color: #09090B; font-family: 'Courier New', Courier, monospace;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #09090B; padding: 36px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="580" cellpadding="0" cellspacing="0" style="max-width: 580px; width: 100%; background: #18181B; border: 2px solid #06B6D4; box-shadow: 0 0 35px rgba(6, 182, 212, 0.25); border-radius: 6px; overflow: hidden;">
                    
                    <!-- Terminal Title Bar -->
                    <tr>
                        <td style="background: #09090B; border-bottom: 2px solid #06B6D4; padding: 10px 16px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="left">
                                        <span style="color: #ef4444; font-weight: bold;">●</span>
                                        <span style="color: #eab308; font-weight: bold;">●</span>
                                        <span style="color: #22c55e; font-weight: bold;">●</span>
                                        <span style="color: #71717a; font-size: 11px; margin-left: 8px;">terminal://chitoria.dev/birthday_payload</span>
                                    </td>
                                    <td align="right">
                                        <span style="background: #083344; color: #22d3ee; font-size: 10px; font-weight: bold; padding: 2px 6px;">
                                            SARCASM_V2
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Terminal Content -->
                    <tr>
                        <td align="left" style="padding: 32px 28px 16px 28px;">
                            <p style="margin: 0 0 6px 0; color: #06B6D4; font-size: 12px;">
                                [ SYSTEM ALERT: 100% UNFLATTERING TRUTH READY ]
                            </p>
                            <h1 style="margin: 0 0 16px 0; font-size: 28px; color: #F43F5E; letter-spacing: -0.5px; line-height: 1.2;">
                                {headline_text}
                            </h1>
                            <p style="margin: 0 0 16px 0; color: #D4D4D8; font-size: 14px; line-height: 1.6;">
                                Anomaly confirmed: biological clock incremented by +1.0 years. Statistical verification of "wisdom" returned NULL. Decrypt your payload below.
                            </p>
                        </td>
                    </tr>

                    {group_badge}
                    {media_block}

                    <!-- Button -->
                    <tr>
                        <td align="center" style="padding: 16px 28px 32px 28px;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="background: #06B6D4; border-radius: 4px; box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);">
                                        <a href="{reveal_url}" target="_blank" style="display: block; padding: 16px 36px; font-family: 'Courier New', monospace; font-size: 16px; font-weight: bold; color: #000000; text-decoration: none; text-transform: uppercase;">
                                            {icon} [ {cta_action.upper()} ]
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background: #09090B; border-top: 1px solid #27272A; padding: 16px 28px;">
                            <p style="margin: 0; color: #71717A; font-size: 11px;">
                                // TRANSMITTED_BY: <span style="color: #22D3EE; font-weight: bold;">{sender_alias}</span>
                            </p>
                        </td>
                    </tr>

                </table>

                <p style="margin: 18px 0 0 0; font-size: 11px; color: #52525B;">
                    // POWERED_BY: chitoria.dev · Midnight Delivery
                </p>
            </td>
        </tr>
    </table>
</body>
</html>"""

    # -------------------------------------------------------------------------
    # 5. CUSTOM (Top Secret / Declassified Luxury Dossier)
    # -------------------------------------------------------------------------
    else:  # custom / secret
        headline_text = escape(custom_headline) if custom_headline else f"CLASSIFIED BIRTHDAY DOSSIER"
        media_block = f"""
        <tr>
            <td align="center" style="padding: 16px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="background: #18181B; border: 1px solid #D4AF37; max-width: 320px; width: 100%;">
                    <tr>
                        <td style="padding: 10px;">
                            <img src="{media_url}" alt="Classified Media" style="display: block; width: 100%; height: auto;" />
                            <p style="margin: 6px 0 0 0; font-family: monospace; font-size: 10px; color: #D4AF37; letter-spacing: 1px;">EVIDENCE ATTACHMENT #01</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        """ if media_url else ""
        
        group_badge = """
        <tr>
            <td align="center" style="padding: 0 32px 16px 32px;">
                <div style="background: #1C1917; border: 1px solid #D4AF37; padding: 6px 14px; font-size: 11px; color: #D4AF37; letter-spacing: 1.5px; text-transform: uppercase;">
                    🕶️ MULTIPLE CODENAMES DECLASSIFIED IN THIS DOSSIER
                </div>
            </td>
        </tr>
        """ if is_group else ""

        return f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Top Secret Birthday Dossier</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: Georgia, -apple-system, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #050505; padding: 36px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="580" cellpadding="0" cellspacing="0" style="max-width: 580px; width: 100%; background: #111113; border: 1px solid #D4AF37; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9); border-radius: 4px; overflow: hidden;">
                    
                    <!-- Gold Accent Line -->
                    <tr>
                        <td style="height: 3px; background: #D4AF37;"></td>
                    </tr>

                    <!-- Dossier Stamp -->
                    <tr>
                        <td align="center" style="padding: 36px 32px 16px 32px;">
                            <div style="display: inline-block; border: 1px solid #D4AF37; padding: 5px 14px; font-family: monospace; font-size: 11px; font-weight: bold; color: #D4AF37; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 20px;">
                                [ 🕶️ TOP SECRET · EYES ONLY ]
                            </div>
                            <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: normal; color: #F5EFEB; letter-spacing: 2px; text-transform: uppercase;">
                                {headline_text}
                            </h1>
                            <p style="margin: 0 0 16px 0; font-family: monospace; font-size: 12px; color: #D4AF37; letter-spacing: 1.5px; text-transform: uppercase;">
                                DESIGNATED RECIPIENT: {recipient_name}
                            </p>
                            <p style="margin: 0; font-family: -apple-system, sans-serif; font-size: 15px; color: #A1A1AA; line-height: 1.6;">
                                An encrypted digital time-capsule has been securely routed to your coordinates. Access authorization has been authenticated.
                            </p>
                        </td>
                    </tr>

                    {group_badge}
                    {media_block}

                    <!-- Button -->
                    <tr>
                        <td align="center" style="padding: 16px 32px 36px 32px;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="background: #D4AF37; border-radius: 2px; box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);">
                                        <a href="{reveal_url}" target="_blank" style="display: block; padding: 16px 36px; font-family: monospace; font-size: 14px; font-weight: bold; color: #000000; text-decoration: none; text-transform: uppercase; letter-spacing: 2px;">
                                            {icon} ACCESS CLASSIFIED FILE →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Dossier Footer -->
                    <tr>
                        <td style="background: #0A0A0C; border-top: 1px solid #27272A; padding: 18px 32px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="left">
                                        <span style="font-family: monospace; font-size: 10px; color: #71717A; letter-spacing: 1px; text-transform: uppercase;">
                                            DEPUTIZED CODENAME:
                                        </span>
                                        <br/>
                                        <span style="font-family: monospace; font-size: 14px; font-weight: bold; color: #D4AF37;">
                                            {sender_alias}
                                        </span>
                                    </td>
                                    <td align="right">
                                        <span style="font-family: monospace; font-size: 10px; color: #52525B;">
                                            SECURITY: TIER-1
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>

                <p style="margin: 20px 0 0 0; font-family: monospace; font-size: 11px; color: #52525B;">
                    ENCRYPTED DISPATCH VIA <a href="{app_url}" style="color: #71717A; text-decoration: none;">chitoria.dev</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>"""

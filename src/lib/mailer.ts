import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || '';
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://chitoria.dev';

function getVibeEmailContent({
  vibe = 'roast',
  recipientName,
  senderAlias = 'Someone Special',
  revealUrl,
  appUrl,
}: {
  vibe?: string;
  recipientName: string;
  senderAlias?: string;
  revealUrl: string;
  appUrl: string;
}) {
  if (vibe === 'roast') {
    return {
      subject: `🔥 Warning: ${recipientName}, you have officially been roasted for your birthday!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin: 0; padding: 0; background-color: #FEF08A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding: 32px 12px; background-color: #FEF08A;">
            <tr><td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%; background: #ffffff; border: 4px solid #000000; box-shadow: 8px 8px 0px #000000;">
                <tr>
                  <td style="background: #F97316; border-bottom: 4px solid #000000; padding: 12px 18px;">
                    <span style="background: #FFEB3B; border: 2px solid #000000; padding: 3px 8px; font-weight: 900; font-size: 11px; text-transform: uppercase;">
                      🔥 LEVEL 10 UNFILTERED ROAST
                    </span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 36px 24px 20px 24px;">
                    <div style="display: inline-block; background: #F43F5E; color: #ffffff; border: 3px solid #000000; box-shadow: 4px 4px 0px #000000; padding: 6px 16px; font-weight: 900; font-size: 12px; text-transform: uppercase; margin-bottom: 16px;">
                      💥 BOOM! BRACE YOUR EGO 💥
                    </div>
                    <h1 style="margin: 0 0 12px 0; font-size: 36px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; color: #000000;">
                      HAPPY BIRTHDAY, ${recipientName.toUpperCase()}!
                    </h1>
                    <p style="margin: 0 0 24px 0; font-size: 16px; font-weight: bold; color: #333333; line-height: 1.5;">
                      A hyper-personalized pop-art roast has been scheduled for your birthday. Someone who knows all your quirks made sure it stings with love.
                    </p>
                    <a href="${revealUrl}" style="display: inline-block; background: #06B6D4; color: #ffffff !important; border: 4px solid #000000; box-shadow: 6px 6px 0px #000000; padding: 18px 36px; font-weight: 900; font-size: 17px; text-transform: uppercase; text-decoration: none; letter-spacing: 1px;">
                      🔥 REVEAL ROAST (IF YOU DARE) →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="background: #F4F4F5; border-top: 3px solid #000000; padding: 16px 20px;">
                    <span style="font-family: monospace; font-size: 11px; color: #71717a;">CONSPIRACY COORDINATOR:</span><br/>
                    <strong style="font-size: 15px; color: #000000;">${senderAlias}</strong>
                  </td>
                </tr>
              </table>
              <p style="margin: 16px 0 0 0; font-size: 11px; font-family: monospace; color: #71717a;">
                Delivered via <a href="${appUrl}" style="color: #000; font-weight: 900;">chitoria.dev</a>
              </p>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    };
  }

  if (vibe === 'sentimental') {
    return {
      subject: `💌 A heartfelt birthday letter for ${recipientName} (Open in private)`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin: 0; padding: 0; background-color: #F7F4EF; font-family: Georgia, serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding: 36px 12px; background-color: #F7F4EF;">
            <tr><td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%; background: #ffffff; border: 1px solid #E7DFD5; border-radius: 16px; box-shadow: 0 10px 35px rgba(90, 70, 50, 0.08); overflow: hidden;">
                <tr><td style="height: 4px; background: #F43F5E;"></td></tr>
                <tr>
                  <td align="center" style="padding: 40px 32px 24px 32px;">
                    <div style="font-size: 32px; margin-bottom: 12px;">💌</div>
                    <p style="margin: 0 0 8px 0; font-size: 13px; font-style: italic; color: #E11D48;">A private letter for your birthday</p>
                    <h1 style="margin: 0 0 16px 0; font-size: 32px; font-weight: normal; color: #1C1917;">Dearest ${recipientName},</h1>
                    <p style="margin: 0 0 28px 0; font-size: 16px; color: #78716C; line-height: 1.6;">
                      Looking back on everything, you are someone who makes the world infinitely warmer. An intimate digital time-capsule has been sealed with words written just for you.
                    </p>
                    <a href="${revealUrl}" style="display: inline-block; background: #E11D48; color: #ffffff !important; border-radius: 9999px; padding: 16px 36px; font-size: 16px; font-weight: bold; text-decoration: none;">
                      💌 Break the Wax Seal & Read →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="background: #FAF7F2; border-top: 1px solid #E7DFD5; padding: 20px 32px; text-align: center;">
                    <p style="margin: 0 0 4px 0; font-size: 12px; font-style: italic; color: #78716C;">Written with love by</p>
                    <p style="margin: 0; font-size: 17px; font-weight: bold; color: #1C1917;">${senderAlias}</p>
                  </td>
                </tr>
              </table>
              <p style="margin: 16px 0 0 0; font-size: 11px; color: #A8A29E;">Delivered with care via chitoria.dev</p>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    };
  }

  if (vibe === 'snarky') {
    return {
      subject: `😏 Status update: ${recipientName} is officially 1 year older...`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin: 0; padding: 0; background-color: #09090B; font-family: 'Courier New', monospace;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding: 36px 12px; background-color: #09090B;">
            <tr><td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%; background: #18181B; border: 2px solid #06B6D4; box-shadow: 0 0 35px rgba(6, 182, 212, 0.25); border-radius: 6px; overflow: hidden;">
                <tr><td style="background: #09090B; border-bottom: 2px solid #06B6D4; padding: 10px 16px; color: #06B6D4; font-size: 11px;">
                  terminal://chitoria.dev/birthday_payload
                </td></tr>
                <tr>
                  <td style="padding: 32px 24px;">
                    <h1 style="margin: 0 0 12px 0; font-size: 26px; color: #F43F5E;">> HAPPY BIRTHDAY, ${recipientName.toUpperCase()}</h1>
                    <p style="margin: 0 0 24px 0; font-size: 14px; color: #D4D4D8; line-height: 1.6;">
                      Anomaly confirmed: biological clock incremented by +1.0 years. Statistical verification of "wisdom" returned NULL. Decrypt your payload below.
                    </p>
                    <a href="${revealUrl}" style="display: inline-block; background: #06B6D4; color: #000000 !important; padding: 14px 32px; font-weight: bold; text-decoration: none; text-transform: uppercase;">
                      ⚡ [ DECRYPT BIRTHDAY STREAM ]
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="background: #09090B; border-top: 1px solid #27272A; padding: 14px 24px; color: #71717A; font-size: 11px;">
                    // TRANSMITTED_BY: <span style="color: #22D3EE;">${senderAlias}</span>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    };
  }

  if (vibe === 'custom') {
    return {
      subject: `🕶️ TOP SECRET: Classified birthday dossier for ${recipientName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin: 0; padding: 0; background-color: #050505; font-family: Georgia, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding: 36px 12px; background-color: #050505;">
            <tr><td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%; background: #111113; border: 1px solid #D4AF37; box-shadow: 0 20px 50px rgba(0,0,0,0.9);">
                <tr><td style="height: 3px; background: #D4AF37;"></td></tr>
                <tr>
                  <td align="center" style="padding: 36px 28px 24px 28px;">
                    <div style="display: inline-block; border: 1px solid #D4AF37; padding: 4px 12px; font-family: monospace; font-size: 10px; color: #D4AF37; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px;">
                      [ 🕶️ TOP SECRET · EYES ONLY ]
                    </div>
                    <h1 style="margin: 0 0 12px 0; font-size: 26px; color: #F5EFEB; letter-spacing: 1px;">CLASSIFIED BIRTHDAY DOSSIER</h1>
                    <p style="margin: 0 0 24px 0; font-size: 14px; color: #A1A1AA; line-height: 1.6;">
                      An encrypted digital time-capsule has been securely routed to your coordinates. Access authorization verified.
                    </p>
                    <a href="${revealUrl}" style="display: inline-block; background: #D4AF37; color: #000000 !important; font-family: monospace; font-size: 14px; font-weight: bold; padding: 14px 32px; text-decoration: none; text-transform: uppercase;">
                      ACCESS CLASSIFIED REVEAL →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="background: #0A0A0C; border-top: 1px solid #27272A; padding: 14px 28px; color: #71717A; font-size: 11px; font-family: monospace;">
                    DEPUTIZED CODENAME: <strong style="color: #D4AF37;">${senderAlias}</strong>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    };
  }

  // Default: sweet
  return {
    subject: `✨ Happy Birthday, ${recipientName}! A special surprise is waiting`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="margin: 0; padding: 0; background-color: #1E0B36; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 36px 12px; background-color: #1E0B36;">
          <tr><td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%; background: #2E1065; border: 2px solid #A855F7; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); overflow: hidden;">
              <tr><td style="height: 6px; background: linear-gradient(90deg, #EC4899, #8B5CF6, #06B6D4, #EAB308);"></td></tr>
              <tr>
                <td align="center" style="padding: 40px 32px 24px 32px;">
                  <div style="display: inline-block; background: linear-gradient(135deg, #EC4899, #F59E0B); color: #ffffff; border-radius: 9999px; padding: 6px 16px; font-size: 12px; font-weight: 800; margin-bottom: 16px;">
                    ✨ INCOMING BIRTHDAY SURPRISE ✨
                  </div>
                  <h1 style="margin: 0 0 12px 0; font-size: 34px; font-weight: 900; color: #ffffff;">
                    Happy Birthday, ${recipientName}! 🎂
                  </h1>
                  <p style="margin: 0 0 28px 0; font-size: 16px; color: #E9D5FF; line-height: 1.6;">
                    An unforgettable interactive birthday experience has been custom built to celebrate you today!
                  </p>
                  <a href="${revealUrl}" style="display: inline-block; background: linear-gradient(135deg, #EC4899, #F59E0B); color: #ffffff !important; border-radius: 12px; padding: 16px 36px; font-size: 16px; font-weight: 800; text-decoration: none;">
                    🎉 Open Your Birthday Surprise ✨
                  </a>
                </td>
              </tr>
              <tr>
                <td style="background: #1F073E; border-top: 1px solid #4C1D95; padding: 18px 32px; text-align: center;">
                  <p style="margin: 0 0 4px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #A855F7; font-weight: bold;">Created with love by</p>
                  <p style="margin: 0; font-size: 18px; font-weight: 800; color: #F0ABFC;">${senderAlias}</p>
                </td>
              </tr>
            </table>
            <p style="margin: 16px 0 0 0; font-size: 11px; color: #A855F7;">Delivered via chitoria.dev</p>
          </td></tr>
        </table>
      </body>
      </html>
    `,
  };
}

export async function sendWishEmail({
  to,
  recipientName,
  senderAlias,
  senderEmailPrefix = 'cheers',
  revealToken,
  vibe = 'sweet',
}: {
  to: string;
  recipientName: string;
  senderAlias?: string;
  senderEmailPrefix?: string;
  revealToken: string;
  vibe?: string;
}): Promise<{ success: boolean; id?: string }> {
  const revealUrl = `${appUrl}/reveal/${revealToken}`;
  const fromAddress = `${senderEmailPrefix}@chitoria.dev`;
  
  const { subject: subjectLine, html: htmlContent } = getVibeEmailContent({
    vibe,
    recipientName,
    senderAlias,
    revealUrl,
    appUrl,
  });

  try {
    if (!resend) {
      console.log(`[Resend Simulation] Dispatched email from ${fromAddress} to ${to}: ${revealUrl}`);
      return { success: true, id: `mock_email_${Date.now()}` };
    }

    const { data, error } = await resend.emails.send({
      from: `chitoria.dev <${fromAddress}>`,
      to: [to],
      subject: subjectLine,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error('Mailer error:', err);
    return { success: false };
  }
}

export async function sendReadReceiptNotification({
  to,
  recipientName,
  openedAt,
}: {
  to: string;
  recipientName: string;
  openedAt: string;
}): Promise<{ success: boolean }> {
  try {
    if (!resend) {
      console.log(`[Resend Simulation] Read receipt sent to ${to}: ${recipientName} opened their wish at ${openedAt}`);
      return { success: true };
    }
    await resend.emails.send({
      from: `chitoria.dev <notifications@chitoria.dev>`,
      to: [to],
      subject: `👀 ${recipientName} just unlocked their birthday reveal!`,
      html: `
        <div style="font-family: sans-serif; background: #09090b; color: #fff; padding: 30px; border-radius: 12px; max-width: 500px; margin: 0 auto;">
          <h2>Your wish was opened! 🎉</h2>
          <p style="color: #a1a1aa;">${recipientName} just clicked and unlocked their birthday experience at ${new Date(openedAt).toLocaleTimeString()}.</p>
          <p style="color: #a1a1aa;">You can check your status anytime on your <a href="${appUrl}/dashboard" style="color: #f43f5e;">Dashboard</a>.</p>
        </div>
      `,
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}

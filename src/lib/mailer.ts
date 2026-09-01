import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || '';
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://chitoria.dev';

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
  const subjectLine =
    vibe === 'roast'
      ? `🔥 Urgent Notice for ${recipientName} — A Birthday Roast Awaits`
      : vibe === 'sentimental'
      ? `💌 A Heartfelt Birthday Message for ${recipientName}`
      : `🎉 Happy Birthday ${recipientName}! You have a surprise waiting`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #ffffff; padding: 40px 20px; }
          .card { max-width: 540px; margin: 0 auto; background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 36px; text-align: center; }
          .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.3); margin-bottom: 20px; }
          h1 { font-size: 26px; font-weight: 800; margin: 0 0 12px; color: #ffffff; }
          p { font-size: 16px; line-height: 1.6; color: #a1a1aa; margin: 0 0 28px; }
          .btn { display: inline-block; background: linear-gradient(135deg, #f43f5e, #f97316); color: #ffffff !important; font-weight: 700; font-size: 16px; padding: 14px 32px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 20px rgba(244, 63, 94, 0.4); }
          .footer { margin-top: 32px; font-size: 12px; color: #71717a; border-top: 1px solid #27272a; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">Special Delivery</div>
          <h1>Happy Birthday, ${recipientName}!</h1>
          <p>
            ${senderAlias ? `<strong>${senderAlias}</strong> has prepared an unforgettable birthday surprise for you.` : 'Someone special has prepared an unforgettable birthday surprise for you.'}
          </p>
          <a href="${revealUrl}" class="btn">Tap to Reveal Your Birthday Wish ✨</a>
          <div class="footer">
            Delivered securely via <a href="${appUrl}" style="color: #f43f5e; text-decoration: none;">chitoria.dev</a><br/>
            Want to create a custom roast or sentimental board for a friend? It’s 100% free.
          </div>
        </div>
      </body>
    </html>
  `;

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

import { Client } from '@upstash/qstash';

const qstashToken = process.env.QSTASH_TOKEN || '';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://chitoria.dev';

export const qstashClient = qstashToken ? new Client({ token: qstashToken }) : null;

export async function scheduleWishDelivery(
  wishId: string,
  targetUtcDate: Date
): Promise<{ success: boolean; messageId?: string }> {
  try {
    if (!qstashClient) {
      console.log(`[QStash Simulation] Scheduled wish ${wishId} for delivery at ${targetUtcDate.toISOString()}`);
      return { success: true, messageId: `mock_qstash_${Date.now()}` };
    }

    const unixSeconds = Math.floor(targetUtcDate.getTime() / 1000);
    const destinationUrl = `${appUrl}/api/deliver`;

    const res = await qstashClient.publishJSON({
      url: destinationUrl,
      body: { wishId },
      notBefore: unixSeconds,
    });

    return { success: true, messageId: res.messageId };
  } catch (error) {
    console.error('Error scheduling with QStash:', error);
    return { success: false };
  }
}

export async function cancelScheduledDelivery(messageId: string): Promise<boolean> {
  try {
    if (!qstashClient || messageId.startsWith('mock_')) {
      console.log(`[QStash Simulation] Cancelled scheduled job ${messageId}`);
      return true;
    }
    const messages = qstashClient.messages;
    await messages.delete(messageId);
    return true;
  } catch (error) {
    console.error('Error cancelling QStash message:', error);
    return false;
  }
}

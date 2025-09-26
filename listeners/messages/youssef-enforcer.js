import { DateTime } from 'luxon';

// --- CONFIGURATION ---
const YOUSSEF_USER_ID = 'U07E8H9A24A'; // <-- Replace with actual Slack user ID for @Youssef
const YOUSSEF_TIMEZONE = 'Africa/Casablanca'; // Set to Youssef's timezone
const CUSTOM_MESSAGE = 'GET BACK TO WORK!';
//const YOUSSEF_USER_ID = 'U092UUVJH6D'; // <-- test id cuz im dumb

// Helper: check if now is between 18:00 and 23:59 in Youssef's timezone
function isBetween6pmAnd12am() {
  const now = DateTime.now().setZone(YOUSSEF_TIMEZONE);
  const isWeekend = now.weekday === 6 || now.weekday === 7; // 6 = Saturday, 7 = Sunday
  return (now.hour >= 18 && now.hour < 24) || !isWeekend;
}

export const getBackToWorkYoussefCallback = async ({ message, client, logger }) => {
  // --- DEBUG LOGGING ---
  logger.info('[YoussefEnforcer] Incoming message:', message);

  try {
    if (!message) {
      logger.info('[YoussefEnforcer] No message object received.');
      return;
    }
    if (message.user !== YOUSSEF_USER_ID) {
      logger.info(`[YoussefEnforcer] Message user (${message.user}) does not match YOUSSEF_USER_ID (${YOUSSEF_USER_ID}).`);
      return;
    }
    if (message.subtype) {
      logger.info(`[YoussefEnforcer] Message has subtype (${message.subtype}), ignoring.`);
      return;
    }
    if (!isBetween6pmAnd12am()) {
      logger.info('[YoussefEnforcer] Not between 18:00 and 24:00, skipping.');
      return;
    }

    logger.info('[YoussefEnforcer] All checks passed, sending message.');

    // If DM, just DM him (redundant, but for completeness)
    if (message.channel_type === 'im') {
      await client.chat.postMessage({
        channel: message.channel,
        text: CUSTOM_MESSAGE,
      });
    } else {
      // Reply in channel/thread
      await client.chat.postMessage({
        channel: message.channel,
        thread_ts: message.ts,
        text: CUSTOM_MESSAGE,
      });
      // Also DM Youssef
      const dm = await client.conversations.open({ users: YOUSSEF_USER_ID });
      await client.chat.postMessage({
        channel: dm.channel.id,
        text: CUSTOM_MESSAGE,
      });
    }
  } catch (error) {
    logger.error(error);
  }
};

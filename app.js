import bolt, { LogLevel } from '@slack/bolt';
import { config } from 'dotenv';
import { registerListeners } from './listeners/index.js';

config();

/** Initialization */
const app = new bolt.App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.INFO,
});

/** Register Listeners */
console.log('[app.js] Registering listeners');
registerListeners(app);

/** Start the Bolt App */
(async () => {
  try {
    console.log('[app.js] Starting Bolt app');
    await app.start();
    app.logger.info('⚡️ Bolt app is running!');
  } catch (error) {
    app.logger.error('Failed to start the app', error);
  }
})();

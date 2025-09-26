//import { sampleMessageCallback } from './sample-message.js';
import { getBackToWorkYoussefCallback } from './youssef-enforcer.js';

export const register = (app) => {
  console.log('[messages/index.js] Registering message listeners');
  //app.message(/^(hi|hello|hey).*/, sampleMessageCallback);
  app.message(getBackToWorkYoussefCallback);
};

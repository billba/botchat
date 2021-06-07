import { ReactNode } from 'react';

import DirectLineActivity from './external/DirectLineActivity';
import SendState from './SendState';

// TODO: Migrate this legacy middleware signature.
type RenderActivityStatusOptions = {
  activity: DirectLineActivity;
  hideTimestamp: boolean;
  sendState: SendState;

  // "nextVisibleActivity" is for backward compatibility, please remove this line on or after 2022-07-22.
  /** @deprecated */
  nextVisibleActivity: DirectLineActivity;

  // "sameTimestampGroup" is for backward compatibility, please remove this line on or after 2022-07-22.
  /** @deprecated */
  sameTimestampGroup: boolean;
};

export type RenderActivityStatus = (options: RenderActivityStatusOptions) => ReactNode;

type ActivityStatusEnhancer = (next: RenderActivityStatus) => RenderActivityStatus;
type ActivityStatusMiddleware = () => ActivityStatusEnhancer;

export default ActivityStatusMiddleware;

import { DirectLineActivity } from 'botframework-webchat-core';
import { ReactNode } from 'react';

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

type RenderActivityStatus = (options: RenderActivityStatusOptions) => ReactNode;

type ActivityStatusEnhancer = (next: RenderActivityStatus) => RenderActivityStatus;
type ActivityStatusMiddleware = () => ActivityStatusEnhancer;

export default ActivityStatusMiddleware;

export type { RenderActivityStatus };

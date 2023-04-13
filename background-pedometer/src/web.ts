import { WebPlugin } from '@capacitor/core';

import type { PedometerServicePlugin } from './definitions';

export class PedometerServiceWeb
  extends WebPlugin
  implements PedometerServicePlugin
{
  async requestPermission(): Promise<{
    value: boolean;
    errMsg: string;
  }> {
    return { value: true, errMsg: '' };
  }

  async enable(option: {
    token: string;
    wsAddress: string;
  }): Promise<{ value: void; errMsg: string }> {
    console.log('enable', option);
    return { value: undefined, errMsg: '' };
  }

  async disable(): Promise<void> {
    console.log('disable');
  }
}

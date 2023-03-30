import { WebPlugin } from '@capacitor/core';

import type { PedometerServicePlugin } from './definitions';

export class PedometerServiceWeb
  extends WebPlugin
  implements PedometerServicePlugin
{
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}

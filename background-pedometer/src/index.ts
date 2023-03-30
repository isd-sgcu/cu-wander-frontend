import { registerPlugin } from '@capacitor/core';

import type { PedometerServicePlugin } from './definitions';

const PedometerService = registerPlugin<PedometerServicePlugin>('PedometerService', {});

export * from './definitions';
export { PedometerService };

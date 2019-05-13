import { IEventType } from './types';

// Event Bus Options
const Events: IEventType = {
  CREATE: 'create',
  REQUEST: 'request',
  RENDER: 'render',
  REFRESH: 'refresh',
  DESTROY: 'destroy',
  FREEZE: 'freeze',
  UNFREEZE: 'unfreeze',
  CLEAR: 'clear',
};

export = Events;

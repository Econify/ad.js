// @flow

import isClient from './isClient';

export default (): boolean => !isClient();

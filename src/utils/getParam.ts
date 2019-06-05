import { Maybe } from '../types';
import isServer from './isServer';

// Util while Url API is not supported in IE11
function getParam(key: string): Maybe<string> {
  if (isServer()) {
    return undefined;
  }

  return (window.location.search.split(`${key}=`)[1] || '').split('&')[0];
}

export default getParam;

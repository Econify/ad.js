import { Maybe } from '../types/maybe';
import isServer from './isServer';

// Util while Url API is not supported in IE11
export default function(key: string): Maybe<string> {
  if (isServer()) {
    return undefined;
  }

  return (window.location.search.split(`${key}=`)[1] || '').split('&')[0];
}

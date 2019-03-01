import Bucket from './Bucket';

const AdJS = {
  activeCorrelatorId: null,
  Bucket,
};

/*
if (typeof window !== 'undefined') {
  window.adjsCmd = window.adjsCmd || [];

  window.adjsCmd.forEach((fn) => {
    fn();
  });

  window.adjsCmd.push = (fn) => {
    fn();
  }
}
*/

export default AdJS;

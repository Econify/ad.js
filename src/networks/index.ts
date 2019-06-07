import DoubleClickForPublishers from './DFP';
import MockAdNetwork from './Mock';
import Noop from './Noop';

const networkList = {
  DoubleClickForPublishers: DoubleClickForPublishers(),
  MockAdNetwork: MockAdNetwork(),
  Noop: Noop(),
};

export default networkList;

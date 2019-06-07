import AutoRefresh from './AutoRefresh';
import AutoRender from './AutoRender';
import DeveloperTools from './DeveloperTools';
import GenericPlugin from './GenericPlugin';
import Responsive from './Responsive';
import Sticky from './Sticky';

const pluginList = {
  AutoRefresh: AutoRefresh(),
  AutoRender: AutoRender(),
  DeveloperTools: DeveloperTools(),
  GenericPlugin: GenericPlugin(),
  Responsive: Responsive(),
  Sticky: Sticky(),
};

export default pluginList;

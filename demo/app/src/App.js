import React, { useState, useEffect } from "react";
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import { Input } from "baseui/input";
import { Slider } from "baseui/slider";
import { StatefulTabs, Tab } from "baseui/tabs";
import AdsSizes from "./components/adsSizes";

window.previewInstance = null;

const defaults = {
  provider: "DFP",
  path: "/2620/nbcnews/homepage_2",
  refreshRateInSeconds: 5,
  offset: 100,
  targeting: `{ "example": "true" }`,
  sizes: {
    desktop: [
      { w: 300, h: 250, checked: true },
      { w: 300, h: 600, checked: true },
      { w: 720, h: 90, checked: false },
      { w: 150, h: 150, checked: false },
      { w: 900, h: 150, checked: false }
    ],
    tablet: [
      { w: 300, h: 250, checked: false },
      { w: 728, h: 90, checked: false },
      { w: 468, h: 60, checked: false },
      { w: 336, h: 280, checked: false }
    ],
    mobile: [
      { w: 320, h: 50, checked: false },
      { w: 300, h: 250, checked: false },
      { w: 336, h: 280, checked: false }
    ]
  }
};

const App = () => {
  const [codePreview, setCodePreview] = useState("");
  // settings
  const [path, setPath] = useState(defaults.path);
  const [provider, setProvider] = useState(defaults.provider);
  const [targeting, setTargeting] = useState(defaults.targeting);
  const [refreshRate, setRefreshRate] = useState(defaults.refreshRateInSeconds);
  const [offset, setOffset] = useState(defaults.offset);
  // plugins
  const [autoRefreshPlugin, setAutoRefreshPlugin] = useState(false);
  const [autoRenderPlugin, setAutoRenderPlugin] = useState(false);
  const [debugPlugin, setDebugPlugin] = useState(false);
  const [loggingPlugin, setLoggingPlugin] = useState(false);
  const [responsivePlugin, setResponsivePlugin] = useState(false);
  const [stickyPlugin, setStickyPlugin] = useState(false);
  // ads
  const [selectedDesktopSizes, setSelectedDesktopSizes] = useState(
    defaults.sizes.desktop
  );
  const [selectedTabletSizes, setSelectedTabletSizes] = useState(
    defaults.sizes.tablet
  );
  const [selectedMobileSizes, setSelectedMobileSizes] = useState(
    defaults.sizes.mobile
  );

  const selectedAds = ads =>
    ads
      .filter(ad => ad.checked === true)
      .map(ad => [ad.w, ad.h])
      .reduce((ads, ad) => ads.concat([ad]), []);

  const buildSetSelection = (setSelected, sizes) => {
    return event => {
      const newSelectedSizes = [...sizes];
      const [currentX, currentY] = event.target.value.split("x");

      newSelectedSizes.forEach(ad => {
        if ((ad.w === parseInt(currentX)) & (ad.h === parseInt(currentY))) {
          return (ad.checked = !ad.checked);
        }
      });
      setSelected(newSelectedSizes);
    };
  };

  const setSelectionDesktop = buildSetSelection(
    setSelectedDesktopSizes,
    selectedDesktopSizes
  );
  const setSelectionTablet = buildSetSelection(
    setSelectedTabletSizes,
    selectedTabletSizes
  );
  const setSelectionMobile = buildSetSelection(
    setSelectedMobileSizes,
    selectedMobileSizes
  );

  const getAdConfiguration = () => {
    const desktopAds = selectedAds(selectedDesktopSizes);
    const tabletAds = selectedAds(selectedTabletSizes);
    const mobileAds = selectedAds(selectedMobileSizes);

    return {
      path: path,
      sizes: {
        mobile: mobileAds,
        tablet: tabletAds,
        desktop: desktopAds
      },
      targeting: JSON.parse(targeting)
    };
  };

  const getBucketConfiguration = () => {
    let plugins = [];

    if (loggingPlugin) plugins.push("Logging");
    if (autoRenderPlugin) plugins.push("AutoRender");
    if (autoRefreshPlugin) plugins.push("AutoRefresh");
    if (debugPlugin) plugins.push("Debug");
    if (stickyPlugin) plugins.push("Sticky");
    if (responsivePlugin) plugins.push("Responsive");

    return {
      plugins: plugins.map(plugin => window.AdJS.Plugins[plugin]),
      defaults: {
        breakpoints: {
          mobile: { from: 0, to: 350 },
          tablet: { from: 351, to: 780 },
          desktop: { from: 781, to: Infinity }
        },
        refreshRateInSeconds: refreshRate,
        offset: offset,
        targeting: JSON.parse(targeting)
      }
    };
  };

  const setSourceCodePreview = returnCode => {
    let sourceCode = `<script type="text/javascript">
  const mainPage = new AdJS.Bucket(AdJS.Networks.${provider}, ${JSON.stringify(
      getBucketConfiguration(),
      null,
      2
    )});

  const el = document.getElementById('ad-slot-1');

  const ad = mainPage.createAd(el, ${JSON.stringify(
    getAdConfiguration(),
    null,
    2
  )});
</script>`;

    setCodePreview(sourceCode);
  };

  useEffect(() => {
    setSourceCodePreview();
    // eslint-disable-next-line
  }, [
    path,
    provider,
    targeting,
    refreshRate,
    offset,
    autoRefreshPlugin,
    autoRenderPlugin,
    debugPlugin,
    loggingPlugin,
    responsivePlugin,
    stickyPlugin,
    selectedDesktopSizes,
    selectedTabletSizes,
    selectedMobileSizes
  ]);

  const previewAd = () => {
    if (window.previewInstance) {
      window.previewInstance.destroy();
    }

    const el = document.getElementById("ad-slot-1");

    const bucket = new window.AdJS.Bucket(
      window.AdJS.Networks[provider],
      getBucketConfiguration()
    );

    window.previewInstance = bucket.createAd(el, getAdConfiguration());
  };

  return (
    <div className="container">
      <StatefulTabs initialState={{ activeKey: "0" }}>
        <Tab title="Ad Preview">
          <div id="ad-slot-1" />
        </Tab>
        <Tab title="Code Preview">
          <div id="code-preview">
            <pre>{codePreview}</pre>
          </div>
        </Tab>
      </StatefulTabs>
      <StatefulTabs initialState={{ activeKey: "1" }}>
        <Tab title="Settings">
          <fieldset>
            <legend>Main settings</legend>

            <Block display="grid" gridTemplateColumns="130px 1fr">
              <label>Network</label>
              <Input
                disabled
                value={provider}
                onChange={event => setProvider(event.target.value)}
              />
            </Block>

            <Block display="grid" gridTemplateColumns="130px 1fr">
              <label>Path</label>
              <Input
                value={path}
                onChange={event => setPath(event.target.value)}
              />
            </Block>

            <Block display="grid" gridTemplateColumns="130px 1fr">
              <label>Targeting</label>
              <Input
                value={targeting}
                onChange={event => setTargeting(event.target.value)}
              />
            </Block>
          </fieldset>
        </Tab>
        <Tab title="Plugins">
          <fieldset>
            <legend>Refresh</legend>
            <Checkbox
              checked={autoRefreshPlugin}
              onChange={() => setAutoRefreshPlugin(!autoRefreshPlugin)}
              checkmarkType={STYLE_TYPE.toggle}
            >
              on/off
            </Checkbox>

            <Slider
              disabled={!autoRefreshPlugin}
              min={0}
              max={60}
              step={5}
              value={[refreshRate]}
              onChange={({ value }) => setRefreshRate(value[0])}
              overrides={{
                TickBar: {
                  style: {
                    display: "none"
                  }
                }
              }}
            />
          </fieldset>
          <fieldset>
            <legend>Rendering</legend>
            <Checkbox
              checked={autoRenderPlugin}
              onChange={() => setAutoRenderPlugin(!autoRenderPlugin)}
              checkmarkType={STYLE_TYPE.toggle}
            >
              on/off
            </Checkbox>

            <label />
            <Slider
              disabled={!autoRenderPlugin}
              min={-200}
              max={200}
              step={10}
              value={[offset]}
              onChange={({ value }) => setOffset(value[0])}
              overrides={{
                TickBar: {
                  style: {
                    display: "none"
                  }
                }
              }}
            />
          </fieldset>

          <fieldset>
            <legend>Debug</legend>
            <Checkbox
              checked={debugPlugin}
              onChange={() => setDebugPlugin(!debugPlugin)}
              checkmarkType={STYLE_TYPE.toggle}
            >
              on/off
            </Checkbox>
          </fieldset>

          <fieldset>
            <legend>Logging</legend>
            <Checkbox
              checked={loggingPlugin}
              onChange={() => setLoggingPlugin(!loggingPlugin)}
              checkmarkType={STYLE_TYPE.toggle}
            >
              on/off
            </Checkbox>
          </fieldset>

          <fieldset>
            <legend>Responsive</legend>
            <Checkbox
              checked={responsivePlugin}
              onChange={() => setResponsivePlugin(!responsivePlugin)}
              checkmarkType={STYLE_TYPE.toggle}
            >
              on/off
            </Checkbox>
          </fieldset>

          <fieldset>
            <legend>Sticky</legend>
            <Checkbox
              checked={stickyPlugin}
              onChange={() => setStickyPlugin(!stickyPlugin)}
              checkmarkType={STYLE_TYPE.toggle}
            >
              on/off
            </Checkbox>
          </fieldset>
        </Tab>
        <Tab title="Sizes">
          <AdsSizes
            breakpoint="Desktop"
            adsSizes={defaults.sizes.desktop}
            setSelection={setSelectionDesktop}
          />

          <AdsSizes
            breakpoint="Tablet"
            adsSizes={defaults.sizes.tablet}
            setSelection={setSelectionTablet}
          />

          <AdsSizes
            breakpoint="Mobile"
            adsSizes={defaults.sizes.mobile}
            setSelection={setSelectionMobile}
          />
        </Tab>
      </StatefulTabs>
      <Button
        className="preview"
        onClick={previewAd}
        overrides={{
          BaseButton: {
            style: {
              gridRowStart: 2,
              gridColumnStart: 2
            }
          }
        }}
      >
        Preview
      </Button>
    </div>
  );
};

export default App;

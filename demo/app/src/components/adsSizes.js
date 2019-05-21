import React from "react";
import { Block } from "baseui/block";
import AdSize from "./adSize";

const AdsSizes = ({ breakpoint, adsSizes, setSelection }) => (
  <fieldset>
    <legend>{breakpoint}</legend>
    <Block
      display="grid"
      gridTemplateColumns="repeat(auto-fill, minmax(100px, 1fr))"
      gridAutoRows="minmax(30px, auto)"
      gridGap="10px"
    >
      {adsSizes.map((ad, i) => (
        <AdSize
          {...ad}
          key={breakpoint + ad.h + "x" + ad.w}
          setSelection={setSelection}
          breakpoint={breakpoint}
        />
      ))}
    </Block>
  </fieldset>
);

export default AdsSizes;

import React from "react";
import { Block } from "baseui/block";
import AdSize from "./adSize";

const AdsSizes = props => {
  const { breakpoint, adsSizes, setSelection } = props;

  return (
    <React.Fragment>
      <label>{breakpoint}</label>
      <Block
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(100px, 1fr))"
        gridAutoRows="minmax(30px, auto)"
        gridGap="10px"
      >
        {adsSizes.map((ad, i) => (
          <AdSize
            {...ad}
            key={i}
            setSelection={setSelection}
            breakpoint={breakpoint}
          />
        ))}
      </Block>
    </React.Fragment>
  );
};

export default AdsSizes;

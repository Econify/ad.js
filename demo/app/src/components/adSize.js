import React from "react";
import { Checkbox } from "baseui/checkbox";

const AdSize = props => {
  const { w, h, checked, setSelection } = props;

  return (
    <Checkbox
      value={`${w}x${h}`}
      checked={checked}
      onChange={setSelection}
    >
      {w}x{h}
    </Checkbox>
  );
};

export default AdSize;

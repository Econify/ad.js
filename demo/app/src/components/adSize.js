import React from "react";
import { Checkbox } from "baseui/checkbox";
import { checkboxOverrides } from "../helpers/overrides";

const AdSize = ({ w, h, checked, setSelection }) => (
  <Checkbox
    value={`${w}x${h}`}
    checked={checked}
    onChange={setSelection}
    overrides={checkboxOverrides}
  >
    {w}x{h}
  </Checkbox>
);

export default AdSize;

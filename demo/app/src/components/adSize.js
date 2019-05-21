import React from "react";
import { Checkbox } from "baseui/checkbox";

const AdSize = ({ w, h, checked, setSelection }) => (
  <Checkbox value={`${w}x${h}`} checked={checked} onChange={setSelection}>
    {w}x{h}
  </Checkbox>
);

export default AdSize;

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { Provider as StyletronProvider } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";

const engine = new Styletron();

ReactDOM.render(
  <StyletronProvider value={engine}>
    <App />
  </StyletronProvider>,
  document.getElementById("root")
);

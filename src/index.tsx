import React from "react";
import ReactDOM from "react-dom";
import { enableMapSet } from "immer";

import Game from "./Game";

enableMapSet();

ReactDOM.render(<Game />, document.getElementById("root"));

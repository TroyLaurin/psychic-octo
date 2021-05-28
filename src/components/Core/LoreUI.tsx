import React, { ReactElement } from "react";
import { useSelector } from "react-redux";

import "./Lore.scss";
import { CoreState } from ".";
import { LoreEntry, LoreState } from "./lore";
import renderTime from "components/util/renderTime";

const renderLore = (entry: LoreEntry, index) => {
  return (
    <li key={index}>
      <span className="timestamp">
        {renderTime(entry.secondsSinceGameStart)}
      </span>{" "}
      <span className="text">{entry.text}</span>
    </li>
  );
};

const Lore: React.FC = (): ReactElement => {
  const lore: LoreState = useSelector((state: CoreState) => state.lore);

  return (
    <footer className="lore">
      <ul>{lore.history.map(renderLore)}</ul>
    </footer>
  );
};

export default Lore;

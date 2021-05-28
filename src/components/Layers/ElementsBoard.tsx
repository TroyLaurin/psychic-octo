import React, { ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LayersState } from ".";

import "./ElementsBoard.css";
import {
  DISCOVER_WILL,
  ElementsCollection,
  ElementsState,
  ElementState,
  FOCUS_WILL,
  forceGen,
  GEN_COST,
  Status,
} from "./elements";
import { Gauge } from "components/util/Gauge";
import { roundDP } from "components/util/roundDP";
import capitalizeFirstLetter from "components/util/capitalizeFirstLetter";

interface ElementProps {
  element: keyof ElementsCollection;
}

const Element = (props: ElementProps): ReactElement => {
  const elementName = props.element;

  const base: ElementsState = useSelector(
    (state: LayersState) => state.elements,
  );

  const element = base.elements[elementName];

  switch (element.status) {
    case Status.HIDDEN:
    case Status.DISCOVERABLE:
      return null;
    case Status.ACTIVE:
    case Status.PASSIVE:
      return (
        <Gauge
          value={element.value}
          max={element.max}
          label={roundDP(1)}
          className={elementName}
        >
          {capitalizeFirstLetter(elementName)}
        </Gauge>
      );
  }
};

const Actions = (): ReactElement => {
  const dispatch = useDispatch();

  const base: ElementsState = useSelector(
    (state: LayersState) => state.elements,
  );

  const ALL_ELEMENTS: Array<keyof ElementsCollection> = [
    "will",
    "air",
    "earth",
    "fire",
    "water",
  ];

  const discoverAction = (name: keyof ElementsCollection) => {
    switch (name) {
      case "will":
        return (
          <button
            key={"discover" + name}
            onClick={() => dispatch({ type: DISCOVER_WILL })}
          >
            Gather your thoughts
          </button>
        );
      case "air":
        return (
          <button
            key={"discover" + name}
            onClick={() => dispatch({ type: FOCUS_WILL })}
          >
            Focus your will
          </button>
        );

      default:
        return null;
    }
  };

  const activeAction = (
    name: keyof ElementsCollection,
    element: ElementState,
    allElements: ElementsCollection,
  ) => {
    const will = allElements.will;
    return (
      <button
        key={"activate" + name}
        onClick={() => dispatch(forceGen(name))}
        disabled={will.value < GEN_COST || element.value >= element.max}
      >
        Generate {name}
      </button>
    );
  };

  const actions = [];
  for (const elt of ALL_ELEMENTS) {
    const element = base.elements[elt];
    if (element.status == Status.DISCOVERABLE) {
      actions.push(discoverAction(elt)); //, element, base.elements));
    } else if (element.status == Status.ACTIVE) {
      actions.push(activeAction(elt, element, base.elements));
    }
  }

  return <div className="actions">{actions}</div>;
};

const ElementsBoard: React.FC = (): ReactElement => {
  return (
    <div className="elementsboard">
      <Element element="will" />
      <Element element="air" />
      <Element element="earth" />
      <Element element="fire" />
      <Element element="water" />

      <Actions />

      {/*      <pre>{JSON.stringify(base, null, 2)}</pre> */}
    </div>
  );
};

export default ElementsBoard;

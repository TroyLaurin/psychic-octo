import React, { ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LayersState } from ".";

import "./ElementsBoard.css";
import { ElementsState, forceGen, GEN_COST } from "./elements";
import { Gauge } from "components/util/Gauge";
import { roundDP } from "components/util/roundDP";

const ElementsBoard: React.FC = (): ReactElement => {
  const dispatch = useDispatch();

  const elements: ElementsState = useSelector(
    (state: LayersState) => state.elements,
  );

  const onForceGen = (element: string) => () => dispatch(forceGen(element));

  return (
    <div className="elementsboard">
      <Gauge
        value={elements.will.value}
        max={elements.will.max}
        label={roundDP(1)}
      >
        Will
      </Gauge>
      <Gauge
        value={elements.air.value}
        max={elements.air.max}
        label={roundDP(1)}
      >
        Air
      </Gauge>
      <Gauge
        value={elements.earth.value}
        max={elements.earth.max}
        label={roundDP(1)}
      >
        Earth
      </Gauge>
      <Gauge
        value={elements.fire.value}
        max={elements.fire.max}
        label={roundDP(1)}
      >
        Fire
      </Gauge>
      <Gauge
        value={elements.water.value}
        max={elements.water.max}
        label={roundDP(1)}
      >
        Water
      </Gauge>
      <div className="actions">
        <button
          id="genair"
          disabled={
            elements.will.value < GEN_COST ||
            elements.air.value >= elements.air.max
          }
          onClick={onForceGen("air")}
        >
          Generate air
        </button>
        <button
          id="genear"
          disabled={
            elements.will.value < GEN_COST ||
            elements.earth.value >= elements.earth.max
          }
          onClick={onForceGen("earth")}
        >
          Generate earth
        </button>
        <button
          id="genfir"
          disabled={
            elements.will.value < GEN_COST ||
            elements.fire.value >= elements.fire.max
          }
          onClick={onForceGen("fire")}
        >
          Generate fire
        </button>
        <button
          id="genwat"
          disabled={
            elements.will.value < GEN_COST ||
            elements.water.value >= elements.water.max
          }
          onClick={onForceGen("water")}
        >
          Generate water
        </button>
      </div>
    </div>
  );
};

export default ElementsBoard;

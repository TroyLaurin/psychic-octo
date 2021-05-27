import React, { useRef, useEffect } from "react";
import SvgGauge from "svg-gauge";

interface GaugeProps {
  dialStartAngle?: number; // The angle in degrees to start the dial (135)
  dialEndAngle?: number; // The angle in degrees to end the dial. This MUST be less than dialStartAngle (45)
  radius?: number; // The radius of the gauge (40)
  min?: number; // The minimum value for the gauge. This can be a negative value (0)
  max?: number; // The maximum value for the gauge (100)
  label?: (value: number) => string; // Optional function that returns a string label that will be rendered in the center. This function will be passed the current value
  showValue?: boolean; // Whether to show the value at the center of the gauge (true)
  gaugeClass?: string; // The CSS class of the gauge (gauge)
  dialClass?: string; // The CSS class of the gauge's dial (dial)
  valueDialClass?: string; // The CSS class of the gauge's fill (value dial) (value)
  valueClass?: string; // The CSS class of the gauge's text (value-text)
  color?: (value: number) => string; // An optional function that can return a color for current value function(value) {}
  viewBox?: string; // An optional string that specifies the crop region (0 0 100 100)
  value: number;
  children?: string | Element;
}

const defaultOptions = {
  animDuration: 1,
  showValue: true,
  initialValue: 0,
  max: 100,
  // Put any other defaults you want. e.g. dialStartAngle, dialEndAngle, radius, etc.
};

export const Gauge = (props: GaugeProps) => {
  const gaugeEl = useRef(null);
  const gaugeRef = useRef(null);
  useEffect(() => {
    if (!gaugeRef.current) {
      const options = { ...defaultOptions, ...props };
      gaugeRef.current = SvgGauge(gaugeEl.current, options);
      gaugeRef.current.setValue(options.initialValue);
    }
    gaugeRef.current.setValueAnimated(props.value, 1);
  }, [props]);

  if (props.children) {
    return (
      <div ref={gaugeEl} className="gauge-container">
        <span className="inner">{props.children}</span>
      </div>
    );
  } else {
    return <div ref={gaugeEl} className="gauge-container" />;
  }
};

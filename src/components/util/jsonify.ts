/* eslint-disable @typescript-eslint/no-explicit-any */

function replacer(_key: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else if (value instanceof Set) {
    return {
      dataType: "Set",
      value: Array.from(value.entries()),
    };
  } else {
    return value;
  }
}
function reviver(_key: string, value: any) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    } else if (value.dataType === "Set") {
      return new Set(value.value);
    }
  }
  return value;
}

export function jsonify(obj: any): string {
  return JSON.stringify(obj, replacer);
}

export function dejsonify(str: string): any {
  return JSON.parse(str, reviver);
}

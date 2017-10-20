import { MalBoolean, MalInteger, MalList, MalNil, MalSymbol, MalType } from "./types";

function pr_str(input: MalType): string {
  if (input instanceof MalBoolean) {
    return input.value ? "true" : "false";
  } else if (input instanceof MalNil) {
    return "nil";
  } else if (input instanceof MalSymbol) {
    return input.name;
  } else if (input instanceof MalInteger) {
    return `${input.value}`;
  } else if (input instanceof MalList) {
    return `(${input.items.map(pr_str).join(" ")})`;
  }
  throw new Error("Expected list, symbol, integer, boolean, or nil");
}

export { pr_str };

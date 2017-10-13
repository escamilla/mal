import { MalInteger, MalList, MalSymbol, MalType } from "./types";

function pr_str(input: MalType): string {
  if (input instanceof MalSymbol) {
    return input.value;
  } else if (input instanceof MalInteger) {
    return `${input.value}`;
  } else if (input instanceof MalList) {
    return `(${input.items.map(pr_str).join(" ")})`;
  }
  throw new Error("Expected list, symbol, or integer");
}

export { pr_str };

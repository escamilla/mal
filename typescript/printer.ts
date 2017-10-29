import { MalBoolean, MalInteger, MalList, MalString, MalSymbol, MalType, MalVector, NodeType } from "./types";

export function prStr(input: MalType, printReadably: boolean): string {
  switch (input.type) {
    case NodeType.Boolean:
      return (input as MalBoolean).value ? "true" : "false";
    case NodeType.Function:
      return "#<function>";
    case NodeType.Integer:
      return `${(input as MalInteger).value}`;
    case NodeType.List:
      const list: MalList = input as MalList;
      return `(${list.items.map((item: MalType) => prStr(item, printReadably)).join(" ")})`;
    case NodeType.Nil:
      return "nil";
    case NodeType.String:
      if (printReadably) {
        return (input as MalString).token;
      } else {
        return `"${(input as MalString).value}"`;
      }
    case NodeType.Symbol:
      return (input as MalSymbol).name;
    case NodeType.Vector:
      const vector: MalVector = input as MalVector;
      return `[${vector.items.map((item: MalType) => prStr(item, printReadably)).join(" ")}]`;
  }
  throw new Error("Expected boolean, function, integer, list, nil, string, or symbol");
}

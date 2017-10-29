import {
  MalBoolean, MalHashMap, MalInteger, MalKeyword, MalList, MalString, MalSymbol, MalType, MalVector, NodeType,
} from "./types";

export function prStr(input: MalType, printReadably: boolean): string {
  switch (input.type) {
    case NodeType.Boolean:
      return (input as MalBoolean).value ? "true" : "false";
    case NodeType.Function:
      return "#<function>";
    case NodeType.HashMap:
      const hashMap: MalHashMap = input as MalHashMap;
      const entryStrings: string[] = hashMap.entries.map((entry: [MalType, MalType]) => {
        const [key, value]: [MalType, MalType] = entry;
        return `${prStr(key, printReadably)} ${prStr(value, printReadably)}`;
      });
      return `{${entryStrings.join(" ")}}`;
    case NodeType.Integer:
      return `${(input as MalInteger).value}`;
    case NodeType.Keyword:
      return (input as MalKeyword).value;
    case NodeType.List:
      const list: MalList = input as MalList;
      return `(${list.items.map((item: MalType) => prStr(item, printReadably)).join(" ")})`;
    case NodeType.Nil:
      return "nil";
    case NodeType.String:
      const value: string = (input as MalString).value;
      if (printReadably) {
        const escaped: string = value
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"')
          .replace(/\n/g, "\\n");
        return `"${escaped}"`;
      } else {
        return value;
      }
    case NodeType.Symbol:
      return (input as MalSymbol).name;
    case NodeType.Vector:
      const vector: MalVector = input as MalVector;
      return `[${vector.items.map((item: MalType) => prStr(item, printReadably)).join(" ")}]`;
  }
  throw new Error("Expected boolean, function, integer, list, nil, string, or symbol");
}

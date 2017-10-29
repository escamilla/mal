export enum NodeType {
  Boolean,
  Function,
  HashMap,
  Integer,
  Keyword,
  List,
  Nil,
  String,
  Symbol,
  Vector,
}

export class MalBoolean {
  public readonly type: NodeType = NodeType.Boolean;

  public constructor(public readonly value: boolean) {
  }
}

export class MalFunction {
  public readonly type: NodeType = NodeType.Function;

  public constructor(public readonly func: (args: MalType[]) => MalType) {
  }
}

export class MalHashMap {
  public readonly type: NodeType = NodeType.HashMap;

  public constructor(public readonly entries: Array<[MalType, MalType]>) {
  }
}

export class MalInteger {
  public readonly type: NodeType = NodeType.Integer;

  public constructor(public readonly value: number) {
  }
}

export class MalKeyword {
  public readonly type: NodeType = NodeType.Keyword;

  public constructor(public readonly value: string) {
  }
}

export class MalList {
  public readonly type: NodeType = NodeType.List;

  public constructor(public readonly items: MalType[]) {
  }
}

export class MalNil {
  public readonly type: NodeType = NodeType.Nil;
}

export class MalString {
  public readonly type: NodeType = NodeType.String;

  public constructor(public readonly value: string, public readonly token: string) {
  }
}

export class MalSymbol {
  public readonly type: NodeType = NodeType.Symbol;

  public constructor(public readonly name: string) {
  }
}

export class MalVector {
  public readonly type: NodeType = NodeType.Vector;

  public constructor(public readonly items: MalType[] = []) {
  }
}

export type MalType = MalBoolean | MalFunction | MalHashMap | MalInteger | MalKeyword |
                      MalList | MalNil | MalString | MalSymbol | MalVector;

export function malEqual(x: MalType, y: MalType): boolean {
  if (x.type !== y.type) {
    return false;
  }

  switch (x.type) {
    case NodeType.Boolean:
      return (x as MalBoolean).value === (y as MalBoolean).value;
    case NodeType.Function:
      // TODO: compare parameters and bodies of functions
      return false;
    case NodeType.Integer:
      return (x as MalInteger).value === (y as MalInteger).value;
    case NodeType.Keyword:
      return (x as MalKeyword).value === (y as MalKeyword).value;
    case NodeType.List:
      const xList: MalList = x as MalList;
      const yList: MalList = y as MalList;
      if (xList.items.length !== yList.items.length) {
        return false;
      }
      for (let i: number = 0; i < xList.items.length; i++) {
        if (!malEqual(xList.items[i], yList.items[i])) {
          return false;
        }
      }
      return true;
    case NodeType.Nil:
      return true;
    case NodeType.String:
      return (x as MalString).value === (y as MalString).value;
    case NodeType.Symbol:
      return (x as MalSymbol).name === (y as MalSymbol).name;
    case NodeType.Vector:
      const xVector: MalVector = x as MalVector;
      const yVector: MalVector = y as MalVector;
      if (xVector.items.length !== yVector.items.length) {
        return false;
      }
      for (let i: number = 0; i < xVector.items.length; i++) {
        if (!malEqual(xVector.items[i], yVector.items[i])) {
          return false;
        }
      }
      return true;
  }

  return false;
}

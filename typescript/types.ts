enum NodeType {
  Boolean,
  Function,
  Integer,
  List,
  Nil,
  String,
  Symbol,
}

class MalBoolean {
  public readonly type: NodeType = NodeType.Boolean;

  public constructor(public readonly value: boolean) {
  }
}

class MalFunction {
  public readonly type: NodeType = NodeType.Function;

  public constructor(public readonly func: (args: MalType[]) => MalType) {
  }
}

class MalInteger {
  public readonly type: NodeType = NodeType.Integer;

  public constructor(public readonly value: number) {
  }
}

class MalList {
  public readonly type: NodeType = NodeType.List;

  public constructor(public readonly items: MalType[]) {
  }
}

class MalNil {
  public readonly type: NodeType = NodeType.Nil;
}

class MalString {
  public readonly type: NodeType = NodeType.String;

  public constructor(public readonly value: string, public readonly token: string) {
  }
}

class MalSymbol {
  public readonly type: NodeType = NodeType.Symbol;

  public constructor(public readonly name: string) {
  }
}

type MalType = MalBoolean | MalFunction | MalInteger | MalList | MalNil | MalString | MalSymbol;

function malEqual(x: MalType, y: MalType): boolean {
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
  }

  return false;
}

export { NodeType, MalBoolean, MalFunction, MalInteger, MalList, MalNil, MalString, MalSymbol, MalType, malEqual };

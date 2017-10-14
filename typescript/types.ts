abstract class MalType {
}

class MalInteger extends MalType {
  public constructor(public readonly value: number) {
    super();
  }
}

class MalSymbol extends MalType {
  public constructor(public readonly name: string) {
    super();
  }
}

class MalList extends MalType {
  public constructor(public readonly items: MalType[]) {
    super();
  }
}

class MalFunction extends MalType {
  public constructor(public readonly func: (args: MalType[]) => MalType) {
    super();
  }
}

export { MalFunction, MalInteger, MalList, MalSymbol, MalType };

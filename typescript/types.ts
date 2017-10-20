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

class MalString extends MalType {
  public constructor(public readonly value: string, public readonly token: string) {
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

class MalBoolean extends MalType {
  public constructor(public readonly value: boolean) {
    super();
  }
}

class MalNil extends MalType {
  public constructor() {
    super();
  }
}

export { MalBoolean, MalFunction, MalInteger, MalList, MalNil, MalString, MalSymbol, MalType };

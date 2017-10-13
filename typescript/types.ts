abstract class MalType {
}

class MalInteger extends MalType {
  public constructor(public readonly value: number) {
    super();
  }
}

class MalSymbol extends MalType {
  public constructor(public readonly value: string) {
    super();
  }
}

class MalList extends MalType {
  public constructor(public readonly items: MalType[]) {
    super();
  }
}

export { MalInteger, MalList, MalSymbol, MalType };

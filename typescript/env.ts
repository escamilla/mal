import { MalSymbol, MalType } from "./types";

class Env {
  private data: Map<string, MalType> = new Map();

  public constructor(private readonly outer?: Env, binds: MalSymbol[] = [], exprs: MalType[] = []) {
    if (binds.length !== exprs.length) {
      throw new Error("Lengths of binds and exprs lists must be equal");
    }
    for (let i: number = 0; i < binds.length; i++) {
      this.set(binds[i], exprs[i]);
    }
  }

  public set(key: MalSymbol, value: MalType): void {
    this.data.set(key.name, value);
  }

  public find(key: MalSymbol): Env | null {
    if (this.data.has(key.name)) {
      return this;
    }
    if (this.outer) {
      return this.outer.find(key);
    }
    return null;
  }

  public get(key: MalSymbol): MalType {
    const env: Env | null = this.find(key);
    if (env) {
      return env.data.get(key.name) as MalType;
    }
    throw new Error(`'${key.name}' not found`);
  }
}

export { Env };

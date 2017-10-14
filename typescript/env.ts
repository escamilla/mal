import { MalSymbol, MalType } from "./types";

class Env {
  private data: Map<string, MalType> = new Map();

  public constructor(private readonly outer?: Env) { }

  public set(key: MalSymbol, value: MalType) {
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

  public get(key: MalSymbol) {
    const env: Env | null = this.find(key);
    if (env) {
      return env.data.get(key.name) as MalType;
    }
    throw new Error(`'${key.name}' not found`);
  }
}

export { Env };

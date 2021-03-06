import * as readline from "readline-sync";
import { Env } from "./env";
import { prStr } from "./printer";
import { readStr } from "./reader";
import { MalFunction, MalHashMap, MalInteger, MalList, MalSymbol, MalType, MalVector} from "./types";

const replEnv: Env = new Env();

replEnv.set(new MalSymbol("+"), new MalFunction(
  (args: MalType[]): MalInteger => {
    const x: MalInteger = args[0] as MalInteger;
    const y: MalInteger = args[1] as MalInteger;
    return new MalInteger(x.value + y.value);
  },
));

replEnv.set(new MalSymbol("-"), new MalFunction(
  (args: MalType[]): MalInteger => {
    const x: MalInteger = args[0] as MalInteger;
    const y: MalInteger = args[1] as MalInteger;
    return new MalInteger(x.value - y.value);
  },
));

replEnv.set(new MalSymbol("*"), new MalFunction(
  (args: MalType[]): MalInteger => {
    const x: MalInteger = args[0] as MalInteger;
    const y: MalInteger = args[1] as MalInteger;
    return new MalInteger(x.value * y.value);
  },
));

replEnv.set(new MalSymbol("/"), new MalFunction(
  (args: MalType[]): MalInteger => {
    const x: MalInteger = args[0] as MalInteger;
    const y: MalInteger = args[1] as MalInteger;
    return new MalInteger(Math.floor(x.value / y.value));
  },
));

function read(input: string): MalType {
  return readStr(input);
}

function eval_(input: MalType, env: Env): MalType {
  if (!(input instanceof MalList)) {
    return evalAst(input, env);
  }

  if (input.items.length === 0) {
    return input;
  }

  const first: MalType = input.items[0];
  if (first instanceof MalSymbol) {
    if (first.name === "def!") {
      const key: MalSymbol = input.items[1] as MalSymbol;
      const value: MalType = eval_(input.items[2], env);
      env.set(key, value);
      return value;
    } else if (first.name === "let*") {
      const newEnv: Env = new Env(env);
      const bindings: MalList = input.items[1] as MalList;
      for (let i: number = 0; i < bindings.items.length; i += 2) {
        const key: MalSymbol = bindings.items[i] as MalSymbol;
        const value: MalType = eval_(bindings.items[i + 1], newEnv);
        newEnv.set(key, value);
      }
      return eval_(input.items[2], newEnv);
    }
  }
  const evaluatedList: MalList = evalAst(input, env) as MalList;
  const fn: MalFunction = evaluatedList.items[0] as MalFunction;
  const args: MalType[] = evaluatedList.items.slice(1);
  return fn.func(args);
}

function evalAst(ast: MalType, env: Env): MalType {
  if (ast instanceof MalSymbol) {
    return env.get(ast);
  } else if (ast instanceof MalList) {
    return new MalList(ast.items.map((item: MalType) => eval_(item, env)));
  } else if (ast instanceof MalVector) {
    return new MalVector(ast.items.map((item: MalType) => eval_(item, env)));
  } else if (ast instanceof MalHashMap) {
    const evaluatedEntries: Array<[MalType, MalType]> = ast.entries.map((entry: [MalType, MalType]) => {
      const [key, value]: [MalType, MalType] = entry;
      return [eval_(key, env), eval_(value, env)] as [MalType, MalType];
    });
    return new MalHashMap(evaluatedEntries);
  }
  return ast;
}

function print(input: MalType): string {
  return prStr(input, true);
}

function rep(input: string): string {
  return print(eval_(read(input), replEnv));
}

while (true) {
  const line: string = readline.question("user> ");
  if (line === "") {
    break;
  }
  try {
    console.log(rep(line)); // tslint:disable-line no-console
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
}

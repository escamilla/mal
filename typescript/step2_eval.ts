import * as readline from "readline-sync";
import { prStr } from "./printer";
import { readStr } from "./reader";
import { MalFunction, MalHashMap, MalInteger, MalList, MalSymbol, MalType, MalVector } from "./types";

type Environment = Map<string, MalType>;

const replEnv: Environment = new Map();

replEnv.set("+", new MalFunction(
  (args: MalType[]): MalInteger => {
    const x: MalInteger = args[0] as MalInteger;
    const y: MalInteger = args[1] as MalInteger;
    return new MalInteger(x.value + y.value);
  },
));

replEnv.set("-", new MalFunction(
  (args: MalType[]): MalInteger => {
    const x: MalInteger = args[0] as MalInteger;
    const y: MalInteger = args[1] as MalInteger;
    return new MalInteger(x.value - y.value);
  },
));

replEnv.set("*", new MalFunction(
  (args: MalType[]): MalInteger => {
    const x: MalInteger = args[0] as MalInteger;
    const y: MalInteger = args[1] as MalInteger;
    return new MalInteger(x.value * y.value);
  },
));

replEnv.set("/", new MalFunction(
  (args: MalType[]): MalInteger => {
    const x: MalInteger = args[0] as MalInteger;
    const y: MalInteger = args[1] as MalInteger;
    return new MalInteger(Math.floor(x.value / y.value));
  },
));

function read(input: string): MalType {
  return readStr(input);
}

function eval_(input: MalType, env: Environment): MalType {
  if (input instanceof MalList) {
    if (input.items.length > 0) {
      const evaluatedList: MalList = evalAst(input, env) as MalList;
      const fn: MalFunction = evaluatedList.items[0] as MalFunction;
      const args: MalType[] = evaluatedList.items.slice(1);
      return fn.func(args);
    } else {
      return input;
    }
  }
  return evalAst(input, env);
}

function evalAst(ast: MalType, env: Environment): MalType {
  if (ast instanceof MalSymbol) {
    if (env.has(ast.name)) {
      return env.get(ast.name) as MalType;
    } else {
      throw new Error(`'${ast.name}' not found`);
    }
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
    console.log(e.message);
  }
}

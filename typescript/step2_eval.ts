import * as readline from "readline-sync";
import { pr_str } from "./printer";
import { read_str } from "./reader";
import { MalFunction, MalInteger, MalList, MalSymbol, MalType } from "./types";

type Environment = Map<string, MalType>;

const repl_env: Environment = new Map();

repl_env.set("+", new MalFunction(
  (args: MalType[]) => {
    const x: MalInteger = args[0] as MalInteger;
    const y: MalInteger = args[1] as MalInteger;
    return new MalInteger(x.value + y.value);
  }
));

repl_env.set("-", new MalFunction(
  (args: MalType[]) => {
    const x: MalInteger = args[0] as MalInteger;
    const y: MalInteger = args[1] as MalInteger;
    return new MalInteger(x.value - y.value);
  }
));

repl_env.set("*", new MalFunction(
  (args: MalType[]) => {
    const x: MalInteger = args[0] as MalInteger;
    const y: MalInteger = args[1] as MalInteger;
    return new MalInteger(x.value * y.value);
  }
));

repl_env.set("/", new MalFunction(
  (args: MalType[]) => {
    const x: MalInteger = args[0] as MalInteger;
    const y: MalInteger = args[1] as MalInteger;
    return new MalInteger(Math.floor(x.value / y.value));
  }
));

function read(input: string): MalType {
  return read_str(input);
}

function eval_(input: MalType, env: Environment): MalType {
  if (input instanceof MalList) {
    if (input.items.length > 0) {
      const evaluatedList: MalList = eval_ast(input, env) as MalList;
      const fn: MalFunction = evaluatedList.items[0] as MalFunction;
      const args: MalType[] = evaluatedList.items.slice(1);
      return fn.func(args);
    } else {
      return input;
    }
  }
  return eval_ast(input, env);
}

function eval_ast(ast: MalType, env: Environment): MalType {
  if (ast instanceof MalSymbol) {
    if (env.has(ast.value)) {
      return env.get(ast.value) as MalType;
    } else {
      throw new Error(`'${ast.value}' not found`);
    }
  } else if (ast instanceof MalList) {
    return new MalList(ast.items.map((item: MalType) => eval_(item, env)));
  }
  return ast;
}

function print(input: MalType): string {
  return pr_str(input);
}

function rep(input: string): string {
  return print(eval_(read(input), repl_env));
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

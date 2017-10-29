import * as readline from "readline-sync";
import { ns } from "./core";
import { Env } from "./env";
import { prStr } from "./printer";
import { readStr } from "./reader";
import { MalBoolean, MalFunction, MalList, MalNil, MalSymbol, MalType, MalVector, NodeType } from "./types";

const replEnv: Env = new Env();

ns.forEach((value: MalFunction, key: string) => {
  replEnv.set(new MalSymbol(key), value);
});

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

  const head: MalType = input.items[0];
  if (head instanceof MalSymbol) {
    if (head.name === "def!") {
      const key: MalSymbol = input.items[1] as MalSymbol;
      const value: MalType = eval_(input.items[2], env);
      env.set(key, value);
      return value;
    } else if (head.name === "let*") {
      const newEnv: Env = new Env(env);
      const bindings: MalList = input.items[1] as MalList;
      for (let i: number = 0; i < bindings.items.length; i += 2) {
        const key: MalSymbol = bindings.items[i] as MalSymbol;
        const value: MalType = eval_(bindings.items[i + 1], newEnv);
        newEnv.set(key, value);
      }
      return eval_(input.items[2], newEnv);
    } else if (head.name === "do") {
      const tail: MalType[] = input.items.slice(1);
      const evaluatedTail: MalType[] = tail.map((item: MalType) => eval_(item, env));
      return evaluatedTail[evaluatedTail.length - 1];
    } else if (head.name === "if") {
      const condition: MalType = input.items[1];
      const result: MalType = eval_(condition, env);
      if ((result.type === NodeType.Nil) || (result.type === NodeType.Boolean && !(result as MalBoolean).value)) {
        if (input.items.length < 4) {
          return new MalNil();
        }
        return eval_(input.items[3], env);
      } else {
        return eval_(input.items[2], env);
      }
    } else if (head.name === "fn*") {
      return ((): MalType => {
        const binds: MalList = input.items[1] as MalList;
        const functionParams: MalSymbol[] = binds.items.map((item: MalType) => {
          if (item.type !== NodeType.Symbol) {
            throw new Error("expected list of symbols for function parameters");
          }
          return item as MalSymbol;
        });
        const functionBody: MalType = input.items[2];
        return new MalFunction((functionArgs: MalType[]): MalType => {
          return eval_(functionBody, new Env(env, functionParams, functionArgs));
        });
      })();
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

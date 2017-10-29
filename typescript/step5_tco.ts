import * as readline from "readline-sync";
import { ns } from "./core";
import { Env } from "./env";
import { prStr } from "./printer";
import { readStr } from "./reader";
import { MalBoolean, MalFunction, MalHashMap, MalList, MalNil, MalSymbol, MalType, MalVector, NodeType } from "./types";

const replEnv: Env = new Env();

ns.forEach((value: MalFunction, key: string) => {
  replEnv.set(new MalSymbol(key), value);
});

function read(input: string): MalType {
  return readStr(input);
}

function eval_(ast: MalType, env: Env): MalType {
  while (true) {
    if (!(ast instanceof MalList)) {
      return evalAst(ast, env);
    }

    if (ast.items.length === 0) {
      return ast;
    }

    const head: MalType = ast.items[0];
    if (head instanceof MalSymbol) {
      if (head.name === "def!") {
        const key: MalSymbol = ast.items[1] as MalSymbol;
        const value: MalType = eval_(ast.items[2], env);
        env.set(key, value);
        return value;
      } else if (head.name === "let*") {
        const newEnv: Env = new Env(env);
        const bindings: MalList = ast.items[1] as MalList;
        for (let i: number = 0; i < bindings.items.length; i += 2) {
          const key: MalSymbol = bindings.items[i] as MalSymbol;
          const value: MalType = eval_(bindings.items[i + 1], newEnv);
          newEnv.set(key, value);
        }
        env = newEnv;
        ast = ast.items[2];
        continue;
      } else if (head.name === "do") {
        const tail: MalType[] = ast.items.slice(1);
        tail.slice(0, tail.length - 1).forEach((item: MalType) => eval_(item, env));
        ast = tail[tail.length - 1];
        continue;
      } else if (head.name === "if") {
        const condition: MalType = ast.items[1];
        const result: MalType = eval_(condition, env);
        if ((result.type === NodeType.Nil) || (result.type === NodeType.Boolean && !(result as MalBoolean).value)) {
          if (ast.items.length < 4) {
            return new MalNil();
          }
          ast = ast.items[3];
        } else {
          ast = ast.items[2];
        }
        continue;
      } else if (head.name === "fn*") {
        const binds: MalList = ast.items[1] as MalList;
        const functionParams: MalSymbol[] = binds.items.map((item: MalType) => {
          if (item.type !== NodeType.Symbol) {
            throw new Error("expected list of symbols for function parameters");
          }
          return item as MalSymbol;
        });
        const functionBody: MalType = ast.items[2];
        const newFn: MalFunction = new MalFunction((functionArgs: MalType[]): MalType => {
          return eval_(functionBody, new Env(env, functionParams, functionArgs));
        });
        newFn.userDefined = true;
        newFn.env = env;
        newFn.params = functionParams;
        newFn.body = functionBody;
        return newFn;
      }
    }
    const evaluatedList: MalList = evalAst(ast, env) as MalList;
    const fn: MalFunction = evaluatedList.items[0] as MalFunction;
    const args: MalType[] = evaluatedList.items.slice(1);
    if (fn.userDefined) {
      ast = fn.body;
      env = new Env(fn.env, fn.params, args);
      continue;
    } else {
      return fn.func(args);
    }
  }
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

rep("(def! not (fn* (a) (if a false true)))");

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

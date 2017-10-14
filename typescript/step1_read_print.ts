import * as readline from "readline-sync";
import { pr_str } from "./printer";
import { read_str } from "./reader";
import { MalType } from "./types";

function read(input: string): MalType {
  return read_str(input);
}

function eval_(input: MalType): MalType {
  return input;
}

function print(input: MalType): string {
  return pr_str(input);
}

function rep(input: string): string {
  return print(eval_(read(input)));
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

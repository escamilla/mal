import * as readline from "readline-sync";

function read(input: string): string {
  return input;
}

function eval_(input: string): string {
  return input;
}

function print(input: string): string {
  return input;
}

function rep(input: string): string {
  return print(eval_(read(input)));
}

while (true) {
  const line: string = readline.question("user> ");
  if (line === "") {
    break;
  }
  console.log(rep(line));
}

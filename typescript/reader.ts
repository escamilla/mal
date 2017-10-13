import { MalInteger, MalList, MalSymbol, MalType } from "./types";

class Reader {
  private index: number = 0;

  public constructor(private readonly tokens: string[]) { }

  public next(): string {
    const token: string = this.tokens[this.index];
    this.index++;
    return token;
  }

  public peek(): string {
    return this.tokens[this.index];
  }
}

function tokenizer(input: string): string[] {
  const malRegex: RegExp = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"|;.*|[^\s\[\]{}('"`,;)]*)/g;
  const tokens: string[] = [];
  while (true) {
      const matches: RegExpExecArray | null = malRegex.exec(input);
      if (matches === null || matches.length === 0) {
        break;
      }
      const match: string = matches[1];
      if (match === "") {
          break;
      }
      tokens.push(match);
  }

  return tokens;
}

function read_str(input: string): MalType {
  const tokens: string[] = tokenizer(input);
  const reader: Reader = new Reader(tokens);
  return read_form(reader);
}

function read_form(reader: Reader): MalType {
  const token: string = reader.peek();
  if (token === "(") {
    return read_list(reader);
  } else {
    return read_atom(reader);
  }
}

function read_list(reader: Reader): MalList {
  let token: string;
  const items: MalType[] = [];
  reader.next(); // skip left parenthesis
  while (true) {
    token = reader.peek();
    if (token === ")") {
      break;
    }
    items.push(read_form(reader));
  }
  reader.next(); // skip right parenthesis
  return new MalList(items);
}

function read_atom(reader: Reader): MalType {
  const token: string = reader.next();
  if (token.match(/\d+/)) {
    return new MalInteger(parseInt(token, 10));
  } else {
    return new MalSymbol(token);
  }
}

export { read_str };

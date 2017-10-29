import { MalBoolean, MalInteger, MalList, MalNil, MalString, MalSymbol, MalType, MalVector } from "./types";

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

export function readStr(input: string): MalType {
  const tokens: string[] = tokenizer(input);
  const reader: Reader = new Reader(tokens);
  return readForm(reader);
}

function readForm(reader: Reader): MalType {
  const token: string = reader.peek();
  if (token === "(") {
    return readList(reader);
  } else if (token === "[") {
    return readVector(reader);
  } else if (token.startsWith('"')) {
    return readString(reader);
  } else {
    return readAtom(reader);
  }
}

function readSequence(reader: Reader, startToken: string, endToken: string): MalType[] {
  let token: string;
  const items: MalType[] = [];
  reader.next(); // skip start token
  while (true) {
    token = reader.peek();
    if (token === endToken) {
      break;
    }
    items.push(readForm(reader));
  }
  reader.next(); // skip end token
  return items;
}

function readList(reader: Reader): MalList {
  return new MalList(readSequence(reader, "(", ")"));
}

function readVector(reader: Reader): MalVector {
  return new MalVector(readSequence(reader, "[", "]"));
}

function readString(reader: Reader): MalString {
  const token: string = reader.next();
  let value: string = token.slice(1, token.length - 1);
  value = value.replace(/\\"/g, '"');
  value = value.replace(/\\n/g, "\n");
  value = value.replace(/\\\\/g, "\\");
  return new MalString(value, token);
}

function readAtom(reader: Reader): MalType {
  const token: string = reader.next();
  if (token === "true") {
    return new MalBoolean(true);
  } else if (token === "false") {
    return new MalBoolean(false);
  } else if (token === "nil") {
    return new MalNil();
  } else if (token.match(/^-?\d+$/)) {
    return new MalInteger(parseInt(token, 10));
  } else {
    return new MalSymbol(token);
  }
}

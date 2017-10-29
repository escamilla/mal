import { prStr } from "./printer";
import { MalBoolean, malEqual, MalFunction, MalInteger, MalList, MalNil, MalString, MalType } from "./types";

export const ns: Map<string, MalFunction> = new Map();

ns.set("+", new MalFunction(
  (args: MalType[]): MalInteger => {
    const x: MalInteger = args[0] as MalInteger;
    const y: MalInteger = args[1] as MalInteger;
    return new MalInteger(x.value + y.value);
  },
));

ns.set("-", new MalFunction(
  (args: MalType[]): MalInteger => {
    const x: MalInteger = args[0] as MalInteger;
    const y: MalInteger = args[1] as MalInteger;
    return new MalInteger(x.value - y.value);
  },
));

ns.set("*", new MalFunction(
  (args: MalType[]): MalInteger => {
    const x: MalInteger = args[0] as MalInteger;
    const y: MalInteger = args[1] as MalInteger;
    return new MalInteger(x.value * y.value);
  },
));

ns.set("/", new MalFunction(
  (args: MalType[]): MalInteger => {
    const x: MalInteger = args[0] as MalInteger;
    const y: MalInteger = args[1] as MalInteger;
    return new MalInteger(Math.floor(x.value / y.value));
  },
));

ns.set("list", new MalFunction(
  (args: MalType[]): MalList => {
    return new MalList(args);
  },
));

ns.set("list?", new MalFunction(
  (args: MalType[]): MalBoolean => {
    return new MalBoolean(args[0] instanceof MalList);
  },
));

ns.set("empty?", new MalFunction(
  (args: MalType[]): MalBoolean => {
    const list: MalList = args[0] as MalList;
    return new MalBoolean(list.items.length === 0);
  },
));

ns.set("count", new MalFunction(
  (args: MalType[]): MalInteger => {
    if (args[0] instanceof MalNil) {
      return new MalInteger(0);
    }
    return new MalInteger((args[0] as MalList).items.length);
  },
));

ns.set("=", new MalFunction(
  (args: MalType[]): MalBoolean => {
    return new MalBoolean(malEqual(args[0], args[1]));
  },
));

ns.set("<", new MalFunction(
  (args: MalType[]): MalBoolean => {
    const x: MalInteger = args[0] as MalInteger;
    const y: MalInteger = args[1] as MalInteger;
    return new MalBoolean(x.value < y.value);
  },
));

ns.set("<=", new MalFunction(
  (args: MalType[]): MalBoolean => {
    const x: MalInteger = args[0] as MalInteger;
    const y: MalInteger = args[1] as MalInteger;
    return new MalBoolean(x.value <= y.value);
  },
));

ns.set(">", new MalFunction(
  (args: MalType[]): MalBoolean => {
    const x: MalInteger = args[0] as MalInteger;
    const y: MalInteger = args[1] as MalInteger;
    return new MalBoolean(x.value > y.value);
  },
));

ns.set(">=", new MalFunction(
  (args: MalType[]): MalBoolean => {
    const x: MalInteger = args[0] as MalInteger;
    const y: MalInteger = args[1] as MalInteger;
    return new MalBoolean(x.value >= y.value);
  },
));

ns.set("pr-str", new MalFunction(
  (args: MalType[]): MalString => {
    const value: string = args.map((arg: MalType) => prStr(arg, true)).join(" ");
    return new MalString(value);
  },
));

ns.set("str", new MalFunction(
  (args: MalType[]): MalString => {
    const value: string = args.map((arg: MalType) => prStr(arg, false)).join("");
    return new MalString(value);
  },
));

ns.set("prn", new MalFunction(
  (args: MalType[]): MalNil => {
    const value: string = args.map((arg: MalType) => prStr(arg, true)).join(" ");
    console.log(value);
    return new MalNil();
  },
));

ns.set("println", new MalFunction(
  (args: MalType[]): MalNil => {
    const value: string = args.map((arg: MalType) => prStr(arg, false)).join(" ");
    console.log(value);
    return new MalNil();
  },
));

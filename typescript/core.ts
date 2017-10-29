import { prStr } from "./printer";
import { MalBoolean, malEqual, MalFunction, MalInteger, MalList, MalNil, MalType } from "./types";

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

ns.set("prn", new MalFunction(
  (args: MalType[]): MalNil => {
    console.log(prStr(args[0], true));
    return new MalNil();
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

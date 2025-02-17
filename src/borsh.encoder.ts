import { Encoder } from "./encoder";
import { registerDecorator } from "visitor-as";

class BorshEncoder extends Encoder{
  constructor(){super("Borsh", "ArrayBuffer")}
  get name(): string { return "bencoded" }
}

export = registerDecorator(new BorshEncoder())
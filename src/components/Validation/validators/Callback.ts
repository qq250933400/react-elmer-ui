import { Validator } from "../Validator";

export class Callback extends Validator {
    public validate(value: any, opt: any): boolean {
        if(typeof this.option.validator === "function") {
            return this.option.validator(value, opt);
        } else {
            this.message = "Undefined validator";
            return false;
        }
    }
}

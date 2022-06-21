import { Validator } from "../Validator";

type TypeIsRequiredProps = {
    allowEmptyString?: boolean;
};

export class isRequired extends Validator {
    public validate(value: any, opt: TypeIsRequiredProps): boolean {
        if(value === null || value === undefined) {
            return false;
        } else if(typeof value === "string") {
            return !opt.allowEmptyString ? value.trim().length > 0 : true;
        } else {
            return true;
        }
    }
}

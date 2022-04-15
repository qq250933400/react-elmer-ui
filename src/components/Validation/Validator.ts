type TypeValidatorOptions = {
    id: string;
    validator?: Function;
    tag?: string;
};

export abstract class Validator {
    public message!: string;
    public option: TypeValidatorOptions;
    public value: any;
    constructor(opt:TypeValidatorOptions) {
        const validateCallback = this.validate;
        this.option = opt;
        this.validate = (value: any, opt: any):boolean => {
            try {
                return validateCallback.call(this, value, opt);
            } catch (err:any) {
                this.message = err.message;
                console.log(err);
                return false;
            }
        }
    }
    public abstract validate(value:any, opt:any):boolean;
    public setValue(value: any): void {
        this.value = value;
    }
    public getValue<T={}>(): T {
        return this.value;
    }
};
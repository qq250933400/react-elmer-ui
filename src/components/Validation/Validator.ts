type TypeValidatorOptions = {
    id: string;
    validator?: Function;
    tag?: string;
    getProps: Function;
    getValue: Function;
};

export abstract class Validator {
    public message!: string;
    public option: TypeValidatorOptions;
    public value: any;
    public validateResult: boolean = false;
    constructor(opt:TypeValidatorOptions) {
        const validateCallback = this.validate;
        this.option = opt;
        this.validate = (value: any, opt?: any):boolean => {
            try {
                const validateResult = validateCallback.call(this, value, {
                    ...this.option.getProps(),
                    ...(opt||{})
                });
                this.validateResult = validateResult;
                if(!validateResult) {
                    if(!(typeof this.message === "string" && this.message.length > 0)) {
                        this.message = this.option.getProps().errMsg;
                    }
                }
                return validateResult;
            } catch (err:any) {
                this.message = err.message;
                console.log(err);
                return false;
            }
        }
    }
    public abstract validate(value:any, opt?:any):boolean;
    public setValue(value: any): void {
        this.value = value;
    }
    public getValue<T={}>(): T {
        return this.value;
    }
};
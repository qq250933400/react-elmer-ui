import { Model } from "../core/Model";
import { IFormDataSchema } from "../types/ISchema";

export default class FormData extends Model {
    private formSchemaConfig: any = {};
    private globalSchemaConfig: any = {};
    private commonFormatCallbacks: any = {};

    registeFormSchame<T={}, TypeFormatCallbacks={}, TypeCommonCallbacks={}>(schema: IFormDataSchema<T, TypeFormatCallbacks, TypeCommonCallbacks>): void {
        if(!this.formSchemaConfig[schema.formCode]) {
            this.formSchemaConfig[schema.formCode] = schema;
        } else {
            throw new Error(`the specified formCode already exists.(${schema.formCode})`);
        }
    }
    registeFormatCallbacks<T={}>(callbacks: { [P in keyof T]: Function}):void {
        callbacks && Object.keys(callbacks).forEach((name: any) => {
            if(!this.commonFormatCallbacks[name]) {
                this.commonFormatCallbacks[name] = (callbacks as any)[name];
            } else {
                throw new Error(`the callback of ${name} already exists in format storage.`);
            }
        });
    }
}
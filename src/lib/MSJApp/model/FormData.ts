import { Model } from "../core/Model";
import { IFormDataSchema, IGlobalDataSchema } from "../types/ISchema";
import { Schema, utils } from "elmer-common";
import { Autowired } from "../core/Autowired";

const CONST_GLOBAL_DATA_KEY = "MSJApp_GlobalData_202204091244";
const CONST_FORM_DATA_KEY = "MSJApp_FormData_202204091244";

export default class FormData extends Model {

    @Autowired(Schema)
    private schema!: Schema;

    private formSchemaConfig: any = {};
    private globalSchemaConfig: IGlobalDataSchema = {} as any;
    private commonFormatCallbacks: any = {};
    private globalData: any = {};

    constructor(api: any) {
        super(api);
        delete (this as any).schema;
    }

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
    registGlobalSchema(schema: IGlobalDataSchema): void {
        this.globalSchemaConfig = schema;
        console.log(this.schema);
    }
    save(key: string, data: any): void {
        const validateProperties:any = this.globalSchemaConfig.properties || {};
        const attrProperty = validateProperties[key] || {};
        if(validateProperties[key]) {
            const validateData:any = {};
            const formatFN = attrProperty.format && !utils.isEmpty(attrProperty?.format) ? ((this.globalSchemaConfig.formatCallbacks || {}) as any)[attrProperty.format] : null;
            const newData = typeof formatFN === "function" ? formatFN(data, this.globalData) : data;
            validateData[key] = data;
            if(this.schema.validate(newData, {
                properties: validateProperties,
            })) {
                this.globalData[key] = data;
                this.api.setData(CONST_GLOBAL_DATA_KEY, this.globalData);
            } else {
                throw new Error(`保存数据格式不正确：${key}, ${this.schema.message}`);
            }
        } else {
            throw new Error(`保存数据未定义schema.(${key})`);
        }
    }
}
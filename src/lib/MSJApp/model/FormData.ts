import { Model } from "../core/Model";
import { IFormDataSchema, IGlobalDataSchema } from "../types/ISchema";
import { Schema, utils } from "elmer-common";
import { Autowired } from "../core/Autowired";
import { ISchemaProperty } from "../types/ISchema";

const CONST_GLOBAL_DATA_KEY = "MSJApp_GlobalData_202204091244";
const CONST_FORM_DATA_KEY = "MSJApp_FormData_202204091244";

type TypeFormatParams = {
    data: any;
    dataType: any;
    validateSchema: ISchemaProperty;
    formatCallbacks: any;
    sourceData: any;
};

export default class FormData extends Model {

    @Autowired(Schema)
    private schema!: Schema;

    private formSchemaConfig: any = {};
    private globalSchemaConfig: IGlobalDataSchema = {} as any;
    private commonFormatCallbacks: any = {};
    private globalData: any = {};
    private formData: any = {};

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
    }
    save(key: string, data: any): void {
        const validateProperties:any = this.globalSchemaConfig.properties || {};
        const attrProperty = validateProperties[key] || {};
        if(validateProperties[key]) {
            const validateData:any = {};
            const validateSchema:any = {};
            validateData[key] = this.formatData({
                data,
                dataType: this.globalSchemaConfig.dataType || {},
                sourceData: this.globalData,
                formatCallbacks: this.globalSchemaConfig.formatCallbacks,
                validateSchema: attrProperty
            });
            validateSchema[key] = attrProperty;
            if(this.schema.validate(validateData, {
                properties: validateSchema,
                dataType: (this.globalSchemaConfig.dataType || {} as any)
            }, "GlobalData")) {
                this.globalData[key] = data;
                this.api.setData(CONST_GLOBAL_DATA_KEY, this.globalData);
            } else {
                throw new Error(`保存数据格式不正确：${key}, ${this.schema.message}`);
            }
        } else {
            throw new Error(`保存数据未定义schema.(${key})`);
        }
    }
    get(key?: string, isSrc?: boolean): any {
        if(key && !utils.isEmpty(key)) {
            const srcData = this.globalData[key];
            const srcValidate = ((this.globalSchemaConfig.properties || {}) as any)[key];
            return isSrc ? srcData : this.formatData({
                data: srcData,
                validateSchema: srcValidate,
                dataType: this.globalSchemaConfig.dataType || {},
                sourceData: this.globalData,
                formatCallbacks: this.globalSchemaConfig.formatCallbacks
            });
        } else {
            return isSrc ? this.globalData : this.formatData({
                data: this.globalData,
                validateSchema: ({
                    type: "Object",
                    properties: this.globalSchemaConfig.properties
                }) as any,
                dataType: this.globalSchemaConfig.dataType,
                sourceData: this.globalData,
                formatCallbacks: this.globalSchemaConfig.formatCallbacks
            });
        }
    }
    /**
     * 保存数据到指定formData
     * @param key - 字段名称
     * @param data - 保存数据
     * @param formCode - 指定formCode
     */
    saveFormData(key: string, data: any, formCode: string): void {
        const formSchema:IFormDataSchema = this.formSchemaConfig[formCode];
        if(!formSchema) {
            throw new Error(`保存FormData失败，指定formCode: ${formCode},未定义formSchema。`);
        } else {
            const attrProperty = (formSchema.properties as any)[key];
            const validateSchema:any = {};
            const validateData: any = {};
            const srcFormData = this.formData[formCode] || {};
            validateSchema[key] = attrProperty;
            validateData[key] = this.formatData({
                data,
                validateSchema: attrProperty,
                dataType: formSchema.dataType || {} as any,
                sourceData: srcFormData,
                formatCallbacks: {
                    ...(this.globalSchemaConfig.formatCallbacks || {}),
                    ...(formSchema.formatCallbacks || {})
                }
            });
            if(this.schema.validate(validateData, validateSchema, `FormData_${formCode}`)) {
                srcFormData[key] = data;
                const allFormData = {
                    ...this.formData
                };
                allFormData[formCode] = srcFormData;
                this.formData = allFormData;
                this.api.setData(CONST_FORM_DATA_KEY, allFormData);
            } else {
                throw new Error(`保存formData失败，${this.schema.message}。`);
            }
        }
    }
    /**
     * 获取指定form 部分数据，设置key获取指定字段值，key为null或undefined或空字符串将返回整个formData
     * @param formCode - 指定formCode
     * @param key - [可选参数]指定字段
     * @param isSrc - [可选参数]是否获取原始保存数据，不经过Format格式化的数据
     * @returns 
     */
    getFormData<T={}>(formCode: string, key?: string, isSrc?: boolean):T {
        const formData = this.formData[formCode] || {};
        const formSchema:IFormDataSchema = this.formSchemaConfig[formCode];
        if(!formSchema) {
            throw new Error(`获取formData不存在，请确定是否已经保存。(formCode: ${formCode})`);
        }
        if(key && !utils.isEmpty(key)) {
            const fieldData = formData[key];
            const attrProperty = (formSchema.properties as any)[key];
            return isSrc ? fieldData : this.formatData({
                data: fieldData,
                validateSchema: attrProperty,
                dataType: {
                    ...(this.globalSchemaConfig.dataType || {}),
                    ...(formSchema.dataType || {})
                },
                sourceData: formData,
                formatCallbacks: {
                    ...(this.globalSchemaConfig.formatCallbacks || {}),
                    ...(formSchema.formatCallbacks || {})
                }
            });
        } else {
            return isSrc ? formData : this.formatData({
                data: formData,
                validateSchema: ({
                    type: "Object",
                    properties: formSchema.properties
                }) as any,
                dataType: {
                    ...(this.globalSchemaConfig.dataType || {}),
                    ...(formSchema.dataType || {})
                },
                sourceData: formData,
                formatCallbacks: {
                    ...(this.globalSchemaConfig.formatCallbacks || {}),
                    ...(formSchema.formatCallbacks || {})
                }
            });
        }
    }
    private formatData(opt: TypeFormatParams): any{
        const {data, validateSchema, dataType, formatCallbacks, sourceData} = opt;
        if(!validateSchema) {
            return data;
        } else {
            const formatFnKey = validateSchema.format;
            const formatFn = formatFnKey && !utils.isEmpty(formatFnKey) ? formatCallbacks[formatFnKey] : null;
            const includeData:any = {};
            if(validateSchema.include) {
                Object.keys(validateSchema.include).forEach((includeKey) => {
                    includeData[includeKey] = utils.getValue(sourceData, includeKey);
                });
            }
            if(validateSchema.type === "String" || validateSchema.type === "Number" || validateSchema.type === "Any" || validateSchema.type === "Boolean" || validateSchema.type === "Array") {
                const defaultValue = validateSchema.defaultValue;
                return typeof formatFn === "function" ? formatFn(data, includeData) || defaultValue : data || defaultValue;
            } else if(validateSchema.type === "Object") {
                if((validateSchema as any).properties) {
                    const objResult:any = {};
                    Object.keys((validateSchema as any).properties).forEach((attrKey: string) => {
                        const nextData = typeof data === "object" ? data[attrKey] : null;
                        const nextSchema = (validateSchema as any).properties[attrKey];
                        const nextResult = this.formatData({
                            data: nextData || validateSchema.defaultValue,
                            validateSchema:nextSchema,
                            dataType,
                            formatCallbacks,
                            sourceData
                        });
                        objResult[attrKey] = nextResult;
                    });
                    return objResult;
                } else {
                    return typeof formatFn === "function" ? formatFn(data) : data;
                }
            } else if(utils.isRegExp(validateSchema.type)){
                // RegExp type data
                const vResult = validateSchema.type.test(data) ? data : null;
                return typeof formatFn === "function" ? formatFn(vResult, includeData) || validateSchema.defaultValue : vResult || validateSchema.defaultValue;
            } else if(utils.isArray(validateSchema.type)) {
                const vResult = validateSchema.type.indexOf(data) >= 0 ? data : validateSchema.defaultValue;
                return typeof formatFn === "function" ? formatFn(vResult, includeData) : vResult;
            } else if(typeof validateSchema.type === "string" && /^#[a-z0-9_]{1,}$/i.test(validateSchema.type)) {
                const useDataTypeKey = validateSchema.type.replace(/^#/,"");
                const useDataValidateSchema = dataType[useDataTypeKey] || (this.globalSchemaConfig.dataType ? this.globalSchemaConfig.dataType[useDataTypeKey] : null);
                if(useDataValidateSchema) {
                    return this.formatData({
                        data,
                        dataType,
                        validateSchema: useDataValidateSchema,
                        formatCallbacks,
                        sourceData
                    });
                }
            } else if(typeof validateSchema.type === "string" && /^Array<#{0,1}[a-zA-Z0-9_]{1,}>/.test(validateSchema.type)) {
                if(utils.isArray(data) && data.length > 0) {
                    const useKeyM = /^Array<#([a-zA-Z0-9_]{1,})>/.exec(validateSchema.type);
                    if(useKeyM) {
                        const useKey = useKeyM[1];
                        const useDataSchema = dataType[useKey] || (this.globalSchemaConfig.dataType ? (this.globalSchemaConfig.dataType as any)[useKey] : null);
                        if(useDataSchema) {
                            const arrResult:any[] = []
                            for(let i=0;i<data.length;i++) {
                                const nextData = data[i];
                                const nextResult = this.formatData({
                                    data: nextData,
                                    validateSchema: useDataSchema,
                                    dataType,
                                    sourceData,
                                    formatCallbacks
                                });
                                arrResult.push(nextResult);
                            }
                            return typeof formatFn === "function" ? formatFn(arrResult, includeData) || validateSchema.defaultValue : arrResult || validateSchema.defaultValue;
                        } else {
                            return [];
                        }
                    } else {
                        const useTypeM = /^Array<([a-zA-Z0-9_]{1,})>/.exec(validateSchema.type);
                        if(useTypeM) {
                            const arrResult: any[] = [];
                            const useType = useTypeM[1];
                            data.forEach((item) => {
                                if(useType === "String") {
                                    typeof item === "string" && arrResult.push(item);
                                    typeof item !== "string" && arrResult.push(null);
                                } else if(useType === "Number") {
                                    typeof item === "number" && arrResult.push(item);
                                    typeof item !== "number" && arrResult.push(null);
                                } else if(useType === "Boolean") {
                                    typeof item === "boolean" && arrResult.push(item);
                                    typeof item !== "boolean" && arrResult.push(null);
                                } else if(useType === "Object") {
                                    typeof item === "object" && arrResult.push(item);
                                    typeof item !== "object" && arrResult.push(null);
                                } else {
                                    arrResult.push(item);
                                }
                            });
                            return typeof formatFn === "function" ? formatFn(arrResult, includeData) || validateSchema.defaultValue : arrResult;
                        } else {
                            return [];
                        }
                    }
                } else {
                    return [];
                }
            }
        }
    }
}
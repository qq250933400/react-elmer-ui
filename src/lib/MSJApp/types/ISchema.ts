type TypeSchemaDataType = "String" | "Number" | "Object" | "Array" | "Boolean" | "Any" | RegExp | String[] | String;

export interface ISchemaProperty<FormatCallback={}> {
    type: TypeSchemaDataType;
    format?: keyof FormatCallback;
    isRequired?: boolean;
    defaultValue?: any;
}

export type ISchemaProperties<T={}, FormatCallback={}> = {
    [ P in keyof T ]: ISchemaProperty<FormatCallback> | {
        type: "Object",
        properties: ISchemaProperties<T[P], FormatCallback>
    }
};

export interface IFormDataSchema<T={}, FormatCallbacks={}, GlobalForamtCallbacks={}> {
    formCode: string;
    properties: ISchemaProperties<T, FormatCallbacks & GlobalForamtCallbacks>,
    formatCallbacks?: FormatCallbacks;
};

export interface IGlobalDataSchema<T={}, FormatCallbacks={}, CommonFormatCallbacks={}> {
    properties: ISchemaProperties<T, FormatCallbacks & CommonFormatCallbacks>;
    formatCallbacks?: FormatCallbacks;
};

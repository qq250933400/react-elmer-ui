export interface IMenuItem<T={}> {
    title: string;
    value: string;
    description?: string;
    visible?: boolean;
    subMenu?: (IMenuItem & T)[];
    icon?: any;
    type?: "Page"|"Api";
};

export type TypeEntryRule = {
    test: RegExp | string;
    page: string;
    default?: boolean;
};

export type IMenuList<T={}>  = (IMenuItem<T> & T)[];

export type TypeCreateMenuResult<T={}> = {
    addMenuItem(menuItem: IMenuItem<T> & T): TypeCreateMenuResult<T>
};
export const CONST_ENTRY_CONFIG_KEY = "MSJApp_Entry_Rule_202203242042";

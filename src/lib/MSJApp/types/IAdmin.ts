export interface IMenuItem<T={}> {
    pageId: string;
    title: string;
    description?: string;
    visible?: boolean;
    subMenu?: (IMenuItem & T)[];
};

export type TypeEntryRule = {
    test: RegExp | string;
    page: string;
};

export type IMenuList<T={}>  = (IMenuItem<T> & T)[];

export type TypeCreateMenuResult<T={}> = {
    addMenuItem(menuItem: IMenuItem<T> & T): TypeCreateMenuResult<T>
};
export const CONST_ENTRY_CONFIG_KEY = "MSJApp_Entry_Rule_202203242042";

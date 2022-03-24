export interface IMenuItem<T={}> {
    pageId: string;
    title: string;
    description?: string;
    visible?: boolean;
    subMenu?: (IMenuItem & T)[];
};

export type IMenuList<T={}>  = (IMenuItem<T> & T)[];

export type TypeCreateMenuResult<T={}> = {
    addMenuItem(menuItem: IMenuItem<T> & T): TypeCreateMenuResult<T>
}

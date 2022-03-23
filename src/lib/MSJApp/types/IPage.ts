export interface IPageInfo {
    path: string;
    id: string;
    title?: string;
    subTitle?: string;
    onBeforeEnter?: string;
    onBeforeNext?: string;
    onBeforeBack?: string;
}
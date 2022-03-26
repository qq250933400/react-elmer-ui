export interface IPageInfo {
    path: string;
    id: string;
    title?: string;
    subTitle?: string;
    /** 页面进入前调用，或preload页面进入时调用 */
    onBeforeEnter?: string;
    /** 用于step page流程 */
    onBeforeNext?: string;
    /** 用于step page流程 */
    onBeforeBack?: string;
    /** 设置Loading页面 */
    preLoad?: string
}
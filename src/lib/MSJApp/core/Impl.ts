import { IPageInfo } from "@MSJApp/types/IPage";
import { Api } from "./Api";

export const ImplFlag = "MSJApp_Impl_202203191129"

export abstract class Impl<UseMode={}, AttachApi={}> {
    public static flag: string = ImplFlag;
    public api: Api<UseMode> & AttachApi;
    constructor(api:Api<UseMode> & AttachApi) {
        this.api = api;
    }
    public abstract nativateTo<T={}>(info: IPageInfo & T, ...args: any[]): any;
    public abstract setData(data: any): void;
    public abstract getData<T={}>(): T;
    public abstract init(opt: any): void;
}
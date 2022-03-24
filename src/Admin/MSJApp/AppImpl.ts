import { Impl, IPageInfo } from "@MSJApp";

export interface IOverrideAppImplInit {
    setState(data: any): void;
    navigateTo(pageInfo: IPageInfo): void;
}

export class AppImpl<M, P> extends Impl<M, P> {
    private opt!: IOverrideAppImplInit;
    private appState: any = {};
    private appInitState: any;
    public init(opt:IOverrideAppImplInit): void {
        this.opt = opt;
        if(this.appInitState && typeof opt.setState === "function") {
            opt.setState(this.appInitState);
        }console.log(opt,"____Init___", this.appInitState);
    }
    public nativateTo(to: string, args: any[]): void {
        throw new Error("Method not implemented.");
    }
    public getData(): any {
        return {
            ...this.appState || {}
        };
    }
    public setData(data: any): void {
        this.appState = data;console.log("data: ", data);
        if(typeof this.opt?.setState !== "function") {
            this.appInitState = data;
        } else {
            this.opt.setState(data);
        }
    }
}

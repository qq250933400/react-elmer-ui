import { Impl, IPageInfo } from "@MSJApp";
import { ElmerService } from "../../HOC/withService/ElmerService";

export interface IOverrideAppImplInit {
    navigateTo(pageInfo: IPageInfo, ...args: any[]): Promise<any>;
    setLocale(locale: string): void;
    setState(data: any): void;
    service: ElmerService;
    getLocale(): string;
}

export class AppImpl<M, P> extends Impl<M, P> {

    public ignoreBeforeEnter: boolean  = true;

    private opt!: IOverrideAppImplInit;
    private appState: any = {};
    private appInitState: any;

    public init(opt: IOverrideAppImplInit): void {
        this.opt = opt;
        if (this.appInitState && typeof opt.setState === "function") {
            opt.setState(this.appInitState);
        }
    }
    public nativateTo<T = {}>(info: IPageInfo & T, ...args: any[]) {
        return this.opt.navigateTo(info, ...args);
    }
    public getData(): any {
        return {
            ...this.appState || {}
        };
    }
    public setData(data: any): void {
        this.appState = data;
        if (typeof this.opt?.setState !== "function") {
            this.appInitState = data;
        } else {
            this.opt.setState(data);
        }
    }
    public ajax<T = {}, R = {}>(opt: R): Promise<T> {
        return this.opt.service.send<T>(opt as any);
    }
    public setLocale(locale: string): void {
        this.opt.setLocale(locale);
    }
    public getLocale(): string {
        return this.opt.getLocale();
    }
}

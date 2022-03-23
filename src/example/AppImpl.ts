import { Impl } from "../lib/MSJApp";

export interface IOverrideAppImplInit {
    setState(data: any): void;
}

export class AppImpl<M, P> extends Impl<M, P> {
    private opt!: IOverrideAppImplInit;
    private appState: any = {};
    public init(opt:IOverrideAppImplInit): void {
        this.opt = opt;
    }
    public nativateTo(to: string, args: any[]): void {
        throw new Error("Method not implemented.");
    }
    public getData(): any {
        return this.appState || {};
    }
    public setData(data: any): void {
        this.appState = data;
        this.opt.setState(data);
    }
}
import { Impl, IPageInfo } from "@MSJApp";

type TypeImplInit = {
    navigateTo: (page: any, state?: any, data?: any) => void;
}

export class EditAppImpl<M, P> extends Impl<M, P> {
    private storeData: any = {};
    private options!: TypeImplInit;
    public init(opt: TypeImplInit): void {
        this.options = opt;
    }
    public ajax<T = {}, R = {}>(opt: R): Promise<T> {
        return Promise.resolve({message: ""}) as any;
    }
    public getData<T = {}>(): T {
        return this.storeData as any;
    }
    public setData(data: any): void {
        this.storeData = { ...this.storeData, ...data};
    }
    public nativateTo<T = {}>(info: IPageInfo & T, state?: any, externalData?: any) {
        return new Promise((resolve) => {
            this.options.navigateTo(info, state, externalData);
            resolve({});
        });
    }
}
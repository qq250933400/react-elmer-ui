import { Impl, ImplFlag } from "./Impl";
import { utils } from "elmer-common";
import { Api } from "./Api";
import { IMSJAppOptions, IMSJAppRunOpt } from "../types/IMSJApp";
import { getWorkspace, CONSTPAGEDATAKEY } from "./PageStorage";

export class MSJApp<UseModel={}, AllApi={}> {
    public api: Api<UseModel> & AllApi;
    private impl: Impl;
    private appId: string;
    constructor(ImplApi: typeof Impl, options: IMSJAppOptions<UseModel, AllApi>) {
        if(ImplApi.flag !== ImplFlag) {
            throw new Error(`参数ImplApi必须是继承Impl的类。`);
        }
        this.appId = "MSJApp_" + utils.guid();
        this.api = new Api<UseModel>({
            useModels: options.models,
            attachApis: options.attachApi
        }) as any;
        this.impl = new (ImplApi as any)(this.api);
        this.api.impl = this.impl as any;
        Object.defineProperty(this.api, "app", {
            value: this,
            enumerable: false,
            configurable: false,
            writable: false
        });
    }
    run<InitIMPL={}>(opt: IMSJAppRunOpt<InitIMPL>): void {
        const workspaceData = getWorkspace(opt.workspace);
        if(!workspaceData) {
            throw new Error(`运行参数workspace未定义。(${opt.workspace})`);
        }
        this.impl.init(opt?.implInit);
        // -------- save data
        const allData:any = this.impl.getData() || {};
        allData[CONSTPAGEDATAKEY] = workspaceData;
        this.impl.setData(allData);
    }
    destory(): void {
        console.log("release all resource");
    }
}

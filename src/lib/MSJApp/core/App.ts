import { Impl, ImplFlag } from "./Impl";
import { utils } from "elmer-common";
import { Api } from "./Api";
import { IMSJAppOptions, IMSJAppRunOpt } from "../types/IMSJApp";
import { getWorkspace, CONSTPAGEDATAKEY } from "./PageStorage";
import { TypeAttachApi } from "./AttachApi";
import { CONST_ENTRY_CONFIG_KEY, TypeEntryRule } from "../types/IAdmin";

export class MSJApp<UseModel={}, AllApi={}> {
    public api: Api<UseModel> & AllApi & TypeAttachApi;
    private impl: Impl;
    private appId: string;
    private workspace!: string;
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
        this.workspace = opt.workspace;
        this.impl.init(opt?.implInit);
        this.api.urlPrefix = opt.urlPrefix || "";
        (this.api as any).workspace = opt.workspace;
        
        // -------- save data
        const allData:any = this.impl.getData() || {};
        allData[CONSTPAGEDATAKEY] = workspaceData;
        this.impl.setData(allData);
        this.gotoHome(opt.location);
    }
    destory(): void {
        console.log("release all resource");
    }
    private gotoHome(pathName?: string) {
        this.api.getConfig<TypeEntryRule[]>(CONST_ENTRY_CONFIG_KEY).then((config) => {
            for(const entry of config) {
                const page = this.api.getPageById(entry.page);
                if(page) {
                    if(utils.isRegExp(entry.test)) {
                        if(entry.test.test(pathName || "")) {
                            this.api.navigateTo(page);
                            return;
                        }
                    } else {
                        const prefixPath = (pathName || "").substring(0, page.path.length);
                        if(prefixPath === page.path || ((utils.isEmpty(pathName) || pathName === "/") && entry.test === "/")) {
                            this.api.navigateTo(page);
                            return;
                        }
                    }
                } else {
                    throw new Error(`entry配置错误页面不存在。${entry.page}`);
                }
            }
        }).catch((err) => {
            this.api.showException(err);
        });
    }
}

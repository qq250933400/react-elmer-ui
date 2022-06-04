import { Impl, ImplFlag } from "./Impl";
import { utils } from "elmer-common";
import { Api } from "./Api";
import { IMSJAppOptions, IMSJAppRunOpt } from "../types/IMSJApp";
import { getWorkspace, CONSTPAGEDATAKEY, clearAllPages } from "./PageStorage";
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
        this.api.debug = options.debug || false;
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
            console.error(`运行参数workspace未定义。(${opt.workspace})`);
        }
        this.workspace = opt.workspace;
        this.impl.init(opt?.implInit);
        this.api.urlPrefix = opt.urlPrefix || "";
        this.api.appId = this.appId;
        this.api.workspace = opt.workspace;
        (this.api as any).workspace = opt.workspace;
        
        // -------- save data
        const allData:any = this.impl.getData() || {};
        allData[CONSTPAGEDATAKEY] = workspaceData;
        this.impl.setData(allData);
        this.gotoHome(opt.location);
    }
    destory(): void {
        clearAllPages();
    }
    private gotoHome(pathName?: string) {
        this.api.getConfig<TypeEntryRule[]>(CONST_ENTRY_CONFIG_KEY).then((config) => {
            let defaultEntry = null;
            let matchEntry = false;
            for(const entry of config) {
                const page = this.api.getPageById(entry.page);
                if(entry.default) {
                    defaultEntry = entry;
                }
                if(page) {
                    if(utils.isRegExp(entry.test)) {
                        if(entry.test.test(pathName || "")) {
                            this.api.navigateTo(page);
                            matchEntry = true;
                            this.api.log(`RegExp: ${JSON.stringify(entry, null, 4)}`, "Debug");
                            this.api.emit("onHomeChange", page);
                            return;
                        }
                    } else {
                        const prefixPath = (pathName || "").substring(0, page.path.length);
                        if(prefixPath === page.path || ((utils.isEmpty(pathName) || pathName === "/") && entry.test === "/")) {
                            matchEntry = true;
                            this.api.navigateTo(page);
                            this.api.log(`String: ${JSON.stringify(entry, null, 4)}`, "Debug");
                            this.api.emit("onHomeChange", page);
                            return;
                        }
                    }
                } else {
                    throw new Error(`entry配置错误页面不存在。${entry.page}`);
                }
            }
            if(!matchEntry && defaultEntry) {
                const page = this.api.getPageById(defaultEntry.page);
                if(page) {
                    this.api.log(`MatchDefault: ${JSON.stringify(defaultEntry, null, 4)}`, "Debug");
                    this.api.navigateTo(page);
                    this.api.emit("onHomeChange", page);
                } else {
                    console.error(`the default entry get a wrong page id.${defaultEntry.page}`);
                }
            }
            this.api.emit("onAfterRun");
        }).catch((err) => {
            this.api.showException(err);
        });
    }
}

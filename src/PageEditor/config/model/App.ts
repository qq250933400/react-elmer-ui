import { IAppData, IAppInfo } from "../../data/IAppInfo";
import { FolderOpenOutlined, ToolOutlined } from "@ant-design/icons";
import Base from "./Base";

export default class App extends Base {
    onBeforeAppInit(data: IAppInfo): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const appData = this.getAppData(data);
            if(appData) {
                resolve(appData);
            } else {
                reject({
                    message: "不支持的工程类型"
                });
            }
        });
    }
    private getAppData(data: IAppInfo):IAppData|undefined {
        if(data.type === "WebPage") {
            return this.WebPageApp(data);
        }
    }
    private WebPageApp(data: IAppInfo): IAppData {
        const webData: IAppData = {
            panels: [
                {
                    title: "project",
                    Icon: FolderOpenOutlined,
                    value: "project"
                }, {
                    title: "component",
                    Icon: ToolOutlined,
                    value: "component"
                }
            ]
        };

        return webData;
    }
}
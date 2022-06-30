import { BaseApp } from "./BaseApp";
import { IPanelData, IPanelSection } from "../types/IApp";
import loadable from "@Component/Loadable";
import { Button } from "antd";

const Section = loadable({
    loader: () => import("../../App/components/Section")
});

export default class WebPage extends BaseApp {
    init(): void {
        this.addEvent("onPanelChange", (item) => {
            console.log("---onChange--tab", item);
        });
    }
    destory(): void {
        (this.event.unBind as any)();
    }
    onProjectInit(): Promise<IPanelData<IPanelSection>> {
        return new Promise((resolve) => {
            resolve([
                {
                    title: "projectFiles",
                    type: "TreeView",
                    value: "top1",
                    Component: Section
                },
                {
                    title: "properties",
                    type: "TreeView",
                    value: "top2",
                    Component: Button
                }
            ]);
        });
    }
    onComponentInit() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ message: "from Component"});
            }, 5000);
        });
    }
}
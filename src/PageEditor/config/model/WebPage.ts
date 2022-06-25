import { BaseApp } from "./BaseApp";

export default class WebPage extends BaseApp {
    init(): void {
        this.addEvent("onCtrlTabChange", () => {
            console.log("---onChange--tab");
        });
    }
    destory(): void {
        (this.event.unBind as any)();
    }
    onProjectInit() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ message: "from Project"});
            }, 5000);
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
import Base from "./Base";
import { createPanel } from "../../Portal/CreatePanel";

export default class Portal extends Base {
    onCreateFile(): void {
        this.api.modal({
            title: "测试提示",
            button: "OkCancel",
            context: createPanel(),
            onConfirm: () => {
                alert("click confirm")
            },
            onBeforeConfirm: () => {
                return new Promise((resolve, reject) => {
                    this.api.emit("onBeforeCreateApp").then((pass: any) => {
                        if(pass) {
                            resolve(pass);
                        } else {
                            reject({ message: "Validation failed" });
                        }
                    }).catch(reject);
                });
            }
        });
    }
    onOpenFile(): void {
        console.log("showOpen");
    }
} 
import Base from "./Base";
import { createPanel } from "../../Portal/CreatePanel";
import { queueCallFunc } from "elmer-common";

export default class Portal extends Base {
    private createPayload: any;
    updateCreatePayload(data: any): void {
        this.createPayload = data;
    }
    onCreateFile(): void {
        this.api.modal({
            title: "测试提示",
            button: "OkCancel",
            context: createPanel(),
            onConfirm: (data: any) => {
                this.api.emit("onAfterCreateApp", data.Submit);
            },
            onBeforeConfirm: () => {
                return queueCallFunc([
                    {
                        id: "Validation",
                        fn: () => {
                            return new Promise((resolve, reject) => {
                                this.api.emit("onBeforeCreateApp").then((pass: any) => {
                                    if (pass) {
                                        resolve(pass);
                                    } else {
                                        reject({ message: "Validation failed" });
                                    }
                                }).catch(reject);
                            });
                        }
                    }, {
                        id: "Submit",
                        fn: () => {
                            return this.service.send({
                                endPoint: "editor.createApp",
                                data: {
                                    name: this.createPayload.name,
                                    type: this.createPayload.type.id
                                }
                            });
                        }
                    }
                ], undefined, { throwException: true });
            }
        });
    }
    onOpenFile(): void {
        console.log("showOpen");
    }
} 
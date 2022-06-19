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
            }
        })
    }
    onOpenFile(): void {
        console.log("showOpen");
    }
} 
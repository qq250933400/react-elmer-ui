import Base from "./Base";

export default class Portal extends Base {
    onCreateFile(): void {
        this.api.modal({
            title: "测试提示",
            // msgType: "OkCancelRetry",
            // msgIcon: "Error",
            button: "OkCancel",
            context: "Hello world 测试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提示",
            onConfirm: () => {
                alert("click confirm")
            }
        })
    }
    onOpenFile(): void {
        console.log("showOpen");
    }
} 
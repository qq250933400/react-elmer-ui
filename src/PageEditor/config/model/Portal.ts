import Base from "./Base";

export default class Portal extends Base {
    onCreateFile(): void {
        this.api.alert({
            title: "测试提示",
            msgType: "OkCancelRetry",
            msgIcon: "Error",
            message: "Hello world 测试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提示测试提示",
            onConfirm: () => {
                alert("click confirm")
            }
        })
    }
    onOpenFile(): void {
        console.log("showOpen");
    }
} 
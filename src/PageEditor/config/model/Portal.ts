import Base from "./Base";

export default class Portal extends Base {
    onCreateFile(): void {
        this.api.createWindow({
            title: "New Window"
        });
    }
    onOpenFile(): void {
        console.log("showOpen");
    }
} 
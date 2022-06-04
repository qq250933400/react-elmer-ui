import Base from "./Base";
import { IMenuList } from "../types/IMenu";

export default class Menu extends Base {
    private isFullScreen: boolean = false;
    public applicationMenu(): IMenuList {
        return [
            { title: "文件", hotKey: "F", items: this.applicationMenuFile() },
            { title: "视图", hotKey: "V", items: this.applicationMenuView() },
            { title: "编辑", hotKey: "E" },
            { title: "帮助", hotKey: "H" }
        ];
    }
    public applicationMenuFile(): IMenuList {
        return [
            { title: "新建文件", hotKey: "Ctrl+N" },
            { title: "新建窗口", hotKey: "Ctrl+W" },
            { title: "", type: "Split" },
            { title: "打开文件", hotKey: "Ctrl+O" },
            { title: "打开最近", items: [
                { title: "保存", hotKey: "Ctrl+S" },
                { title: "另存为", hotKey: "Ctrl+Shift+S" }
            ]},
            { title: "", type: "Split" },
            { title: "保存", hotKey: "Ctrl+S" },
            { title: "另存为", hotKey: "Ctrl+Shift+S" },
            { title: "", type: "Split" },
            { title: "关闭文件", hotKey: "Ctrl+Q" },
            { title: "关闭窗口", hotKey: "ECS" },
        ];
    }
    public applicationMenuView(): IMenuList {
        return [
            { title: "全屏", hotKey: "F11", value: "menu.onFullScreenSwitch" }
        ];
    }
    public onFullScreenSwitch(): void {
        if(this.isFullScreen) {
            this.api.emit("onFullScreenChange", false);
            this.isFullScreen = false;
        } else {
            this.api.emit("onFullScreenChange", true);
            this.isFullScreen = true;
        }
    }
    public isFullScreenStatus() {
        let isFull = document.fullscreenEnabled ||
            (window as any).fullScreen ||
            (document as any).webkitIsFullScreen ||
            (document as any).msFullscreenEnabled;
        if (isFull === undefined) { isFull = false; }
        return isFull;
    }
    public onWindowResize() {
        const isFullStatus = this.isFullscreenEnabled();
        console.log(isFullStatus, "_size_");
        if(isFullStatus !== this.isFullScreen) {
            this.isFullScreen = isFullStatus;
        }
    }
    private isFullscreenEnabled() {
        return  (
            (document as any).fullscreenEnabled ||
            (document as any).mozFullScreenEnabled ||
            (document as any).webkitFullscreenEnabled ||
            (document as any).msFullscreenEnabled
        );
    }
}
import Base from "./Base";
import { IMenuList, IMenuInfo } from "../types/IMenu";

export default class Menu extends Base {
    private isFullScreen: boolean = false;
    private locale!: string;
    private langugages!: any[];
    private setLocale!: Function;
    private getMessages!: Function;
    private i18nKey!: string;
    public updateLocaleMenus(data:any): void {
        this.locale = data.locale;
        this.langugages = data.languages || [];
        this.setLocale = data.setLocale;
        this.getMessages = data.getMessages;
        this.i18nKey = data.name;
        this.api.emit("onMenuChange", this.applicationMenu());
    }
    public applicationMenu(): IMenuList {
        return [
            { title: this.getMessage("menu.file"), hotKey: "F", items: this.applicationMenuFile() },
            { title: this.getMessage("menu.view"), hotKey: "V", items: this.applicationMenuView() },
            { title: this.getMessage("menu.edit"), hotKey: "E" },
            { title: this.getMessage("menu.help"), hotKey: "H", items: this.applicationMenuHelp() }
        ];
    }
    public applicationMenuFile(): IMenuList {
        return [
            { title: this.getMessage("menu.file.newFile"), hotKey: "Ctrl+N", value: "portal.onCreateFile" },
            { title: this.getMessage("menu.file.newWindow"), hotKey: "Ctrl+W" },
            { title: "", type: "Split" },
            { title: this.getMessage("menu.file.openFile"), hotKey: "Ctrl+O" },
            { title: this.getMessage("menu.file.openHistory"), items: [
                { title: "保存", hotKey: "Ctrl+S" },
                { title: "另存为", hotKey: "Ctrl+Shift+S" }
            ]},
            { title: "", type: "Split" },
            { title: this.getMessage("menu.file.save"), hotKey: "Ctrl+S" },
            { title: this.getMessage("menu.file.saveAs"), hotKey: "Ctrl+Shift+S" },
            { title: "", type: "Split" },
            { title: this.getMessage("menu.file.close"), hotKey: "Ctrl+Q", value: "menu.onCloseFile" },
            { title: this.getMessage("menu.file.exit"), hotKey: "ECS" },
        ];
    }
    public applicationMenuHelp(): IMenuList {
        const lngMenus: IMenuList = [];
        if(this.langugages?.length > 0) {
            this.langugages.forEach((item) => {
                lngMenus.push({
                    title: item.title,
                    value: "menu.switchLang",
                    args: item.value,
                    checked: item.value === this.locale
                });
            });
        }
        return [
            
            { title: this.getMessage("menu.help.doc"), },
            { title: this.getMessage("menu.help.releaseLog")},
            { title: "", type: "Split" },
            { title: this.getMessage("menu.help.language"), items: lngMenus}
        ];
    }
    public switchLang(item: IMenuInfo) {
        if(item.args) {
            this.locale = item.args;
            this.setLocale(item.args);
        }
    }
    public onCloseFile(): void {
        this.api.emit("onRemoveFromStore", "editor.currentApp");
        this.api.goto("portal");
    }
    public applicationMenuView(): IMenuList {
        return [
            { title: !this.isFullScreen ? this.getMessage("menu.view.fullScreen") : this.getMessage("menu.view.exitFullScreen"), hotKey: !this.isFullScreen ? "F11" : "ESC", value: "menu.onFullScreenSwitch" }
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
        this.api.emit("onMenuChange", this.applicationMenu());
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
        if(isFullStatus) {
            if(this.isFullScreen !== document.fullscreen) {
                this.isFullScreen = document.fullscreen;
                this.api.emit("onMenuChange", this.applicationMenu());
            }
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
    private getMessage(id: string): string {
        const messages = this.getMessages();
        const msg = messages[this.locale as any] || {};
        const dataKey = this.i18nKey ? this.i18nKey + "." + id : id;
        return msg[dataKey] || id;
    }
}
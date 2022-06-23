type TypeAppType = "WebPage" | "Markdown";

interface IPanel {
    Icon: React.ComponentType<any>;
    title: string;
    value: string;
}

export declare interface IAppInfo {
    name: string;
    type: TypeAppType;
    fileName: string;
}

export declare interface IAppData {
    panels: IPanel[];
}
import { IPageInfo } from "./IPage";

export interface IEventHandlers {
    onInit(): void;
    onAfterRun(): void;
    onHomeChange(pageInfo: IPageInfo): void;
}

export type TypeLogType = "Info" | "Error" | "Warn" | "Debug";
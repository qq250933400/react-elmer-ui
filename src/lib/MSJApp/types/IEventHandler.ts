export interface IEventHandlers {
    onInit(): void;
    onAfterRun(): void;
}

export type TypeLogType = "Info" | "Error" | "Warn" | "Debug";
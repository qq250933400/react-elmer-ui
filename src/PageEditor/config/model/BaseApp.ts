import Base from "./Base";
import { Observe } from "elmer-common";
import { IAppEvent } from "../types/IApp";


export abstract class BaseApp extends Base {
    public event: Observe<IAppEvent> = new Observe<IAppEvent>();
    abstract init(): void;
    abstract destory(): void;
    callEvent<Name extends keyof IAppEvent>(eventName: Name, ...args: any[]): any {
        return this.event.emit(eventName, ...args);
    }
    addEvent<Name extends keyof IAppEvent>(eventName: Name, callback: IAppEvent[Name]): Function {
        return this.event.on(eventName, callback);
    }
}
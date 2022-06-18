import { Observe } from "elmer-common";

type TypeEventHandler = {
    close: (uid: string, options: any) => void;
};

class WindowEventHandler extends Observe<TypeEventHandler> {
    
}

export const eventBus = new WindowEventHandler();

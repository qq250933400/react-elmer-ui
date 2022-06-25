import { useCallback } from "react";
import { IAppEvent } from "../../config/types/IApp";
import { editApp } from "../../config";

export const useApp = (appKey: string) => {
    const callEvent = useCallback(<Name extends keyof IAppEvent>(name: Name, ...args:any[])=>{
        return editApp.callApiEx(`${appKey}.callEvent`, ...args);
    }, [appKey]);
    return {
        emit: callEvent
    };
};

import { IWindowProps } from "./IWindowModel";
import { useMemo, createContext, useState, useCallback, useContext } from "react";
import { Window as AWindow } from "./Window";
import ReactDOM from "react-dom";

type TypeContainerProps = {
    data: IWindowProps[];
    children?: any;
};
type TypeWindowModelProps = {
    config: IWindowProps;
};

const CONST_WINDOW_CONTAINER_ID: string = "CONST_WINDOW_CONTAINER_202206052023";

const getRootContainer = () => {
    let div = document.getElementById(CONST_WINDOW_CONTAINER_ID);
    if(div) {
        return div;
    } else {
        div = document.createElement("div");
        div.id = CONST_WINDOW_CONTAINER_ID;
        div.className = "theme_dark";
        document.body.appendChild(div);
        return div;
    }
};

const WindowModel = ({ config }: TypeWindowModelProps) => {
    const container = useMemo(() => getRootContainer(), []);
    const WindowApp = useMemo(() => {
        const WindowApp = <AWindow {...config}/>
        if(config.hasMask) {
            return <div>{WindowApp}</div>
        } else {
            return WindowApp;
        }
    }, [config]);
    return ReactDOM.createPortal(WindowApp, container);
};

const ModelContext = createContext({
    createWindow:(opt: IWindowProps) => {}
});

export const useModel = () => useContext(ModelContext);

export const Container = (props: TypeContainerProps) => {
    const [ windowList, setWindowList ] = useState<IWindowProps[]>([]);
    const [ state ] = useState<{ windows: any[] }>({
        windows: []
    });
    const createWindow = useCallback((winProps:IWindowProps) => {
        const newList = [...state.windows, winProps];
        state.windows = newList as any[];
        setWindowList(newList);
    }, [state]);
    return (
        <ModelContext.Provider value={{
            createWindow
        }}>
            {props.children}
            {
                windowList.length > 0 && windowList.map((item, index) => {
                    return <WindowModel config={item} key={index}/>;
                })
            }
        </ModelContext.Provider>
    );
};
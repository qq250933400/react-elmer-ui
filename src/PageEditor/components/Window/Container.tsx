/* eslint-disable react-hooks/exhaustive-deps */
import { IWindowProps, IAlertOption, IModal } from "./IWindowModel";
import { useMemo, createContext, useState, useCallback, useContext } from "react";
import { Window as AWindow } from "./Window";
import { queueCallFunc, utils } from "elmer-common";
import { Alert, createAlertButton, TypeAlertButton } from "./Alert";
import { eventBus } from "./EventHandler";
import ReactDOM from "react-dom";
import styles from "../style.module.scss";
import rootStyles from "../../styles/theme.module.scss";
import cn from "classnames";
import { invoke } from "../../../utils";

type TypeContainerProps = {
    attachRoot?: boolean;
    children?: any;
};
type TypeWindowModelProps = {
    config: IWindowProps;
    onClose: Function;
    attachRoot?: boolean;
};

const CONST_WINDOW_CONTAINER_ID: string = "CONST_WINDOW_CONTAINER_202206052023";

const getRootContainer = () => {
    let div = document.getElementById(CONST_WINDOW_CONTAINER_ID);
    if(div) {
        return div;
    } else {
        div = document.createElement("div");
        div.id = CONST_WINDOW_CONTAINER_ID;
        div.className = cn("theme_dark", rootStyles.editorApplication);
        document.body.appendChild(div);
        return div;
    }
};

const WindowModel = ({ config, onClose, attachRoot }: TypeWindowModelProps) => {
    const WindowApp = useMemo(() => {
        const WindowApp = (<AWindow
            title={config.title}
            icon={config.icon}
            hideIcon={config.hideIcon}
            uid={config.uid}
            onClose={onClose}
            bottom={config.showBottom ? config.bottom : false}
            options={{
                hideClose: config.hideClose,
                hideMax: config.hideMax,
                hideMin: config.hideMin,
                canMove: config.canMove,
                showAnimation: config.showAnimation,
                hideAnimation: config.hideAnimation,
            }}
        >{config.context}</AWindow>
        );
        if(config.hasMask) {
            return <div className={styles.windowMask}>{WindowApp}</div>
        } else {
            return WindowApp;
        }
    }, [config]);
    if(attachRoot) {
        return ReactDOM.createPortal(WindowApp, getRootContainer());
    } else {
        return WindowApp;
    }
};

const ModelContext = createContext({
    createWindow: (opt: IWindowProps) => {},
    alert: (option:IAlertOption) => {},
    modal: (option: IModal) => {}
});

export const useModel = () => useContext(ModelContext);

export const Container = (props: TypeContainerProps) => {
    const [ windowList, setWindowList ] = useState<IWindowProps[]>([]);
    const [ state ] = useState<{ windows: any[] }>({
        windows: []
    });
    const onWindowClose = useCallback((uid: string, opt: any, srcOpt:IWindowProps) => {
        const newListData: IWindowProps[] = [];
        state.windows.forEach((item) => {
            if(item.uid !== uid) {
                newListData.push({ ...item });
            }
        });
        state.windows = newListData;
        setWindowList(newListData);
        typeof srcOpt.onClose === "function" && srcOpt.onClose(opt, srcOpt);
    }, [windowList,state, setWindowList]);
    const createWindow = useCallback((winProps:IWindowProps) => {
        const newList = [...state.windows, {
            ...winProps,
            uid: winProps.uid || ("window_" + utils.guid())
        } as IWindowProps];
        state.windows = newList as any[];
        setWindowList(newList);
    }, [state]);
    const alert = useCallback((option: IAlertOption) => {
        const uid = "window_" + utils.guid();
        const bottomNode = createAlertButton(option.msgType || "OkOnly", option, ((_id) => {
            return (type, opt) => {
                eventBus.emit("close", _id, {
                    type,
                    option: opt
                });
            };
        })(uid));
        createWindow({
            uid,
            title: option.title,
            context: <Alert msgIcon={option.msgIcon || "Info"}><span>{option.message}</span></Alert>,
            icon: option.icon,
            hideMax: true,
            hideMin: true,
            hideIcon: option.hideIcon,
            showBottom: true,
            hasMask: true,
            bottom: (<div className={cn(styles.alertBottom, "AlertBottom", option.msgType)}>{bottomNode}</div>),
            onClose: (opt: { type: TypeAlertButton, option: IAlertOption }) => {
                if(opt?.type === "Confirm") {
                    typeof option.onConfirm === "function" && option.onConfirm();
                } else if(opt?.type === "Retry") {
                    typeof option.onRetry === "function" && option.onRetry();
                } else {
                    typeof option.onCancel === "function" && option.onCancel();
                }
            }
        });
    }, [createWindow, state]);
    const modal = useCallback((option: IModal) => {
        const uid = "window_" + utils.guid();
        const bottomNode = createAlertButton(option.button || "OkOnly", option, ((_id) => {
            return (type, opt) => {
                queueCallFunc([
                    {
                        id: "onBeforeConfirm",
                        fn: ():any => {
                            if(type === "Confirm" && typeof opt.onBeforeConfirm === "function") {
                                return invoke(opt.onBeforeConfirm);
                            }
                        }
                    }, {
                        id: "onBeforeCancel",
                        fn: ():any => {
                            if(type === "Cancel" && typeof opt.onBeforeCancel === "function") {
                                return invoke(opt.onBeforeCancel);
                            }
                        }
                    }, {
                        id: "onBeforeRetry",
                        fn: ():any => {
                            if(type === "Retry" && typeof opt.onBeforeRetry === "function") {
                                return invoke(opt.onBeforeRetry);
                            }
                        }
                    }
                ], undefined, {
                    throwException: true
                }).then((data: any) => {
                    let nextData = null;
                    if(type === "Confirm") {
                        nextData = data.onBeforeConfirm;
                    } else if(type === "Cancel") {
                        nextData = data.onBeforeCancel;
                    } else {
                        nextData = data.onBeforeRetry;
                    }
                    eventBus.emit("close", _id, {
                        type,
                        option: opt,
                        data: nextData
                    });console.log(type,"--BeforeResult--", nextData);
                }).catch((err) => {
                    console.error(err.exception || err);
                });
            };
        })(uid));
        createWindow({
            uid,
            title: option.title,
            context: option.context,
            icon: option.icon,
            hideMax: true,
            hideMin: true,
            hideIcon: option.hideIcon,
            showBottom: true,
            hasMask: true,
            bottom: (<div className={cn(styles.alertBottom, "AlertBottom", option.button)}>{bottomNode}</div>),
            onClose: (opt: { type: TypeAlertButton, option: IAlertOption, data: any }) => {
                if(opt?.type === "Confirm") {
                    typeof option.onConfirm === "function" && option.onConfirm(opt.data);
                } else if(opt?.type === "Retry") {
                    typeof option.onRetry === "function" && option.onRetry(opt.data);
                } else {
                    typeof option.onCancel === "function" && option.onCancel(opt.data);
                }
            }
        });
    }, [createWindow, state]);
    return (
        <ModelContext.Provider value={{
            createWindow,
            alert,
            modal
        }}>
            {props.children}
            {
                windowList.length > 0 && windowList.map((item, index) => {
                    return <WindowModel
                        attachRoot={props.attachRoot}
                        onClose={(uid: string, opt:any) => onWindowClose(uid, opt, item)}
                        config={item}
                        key={item.uid || index}
                    />
                })
            }
        </ModelContext.Provider>
    );
};
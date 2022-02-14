import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useCallback, useContext, useMemo } from "react";
import { utils } from "elmer-common";
const HocContext = createContext({
    data: {},
    setData: (newData) => { },
    getData: (key) => { }
});
const localKey = "HOC_c71e18cd492829dede9e5053d843";
export const WithHOCProvider = (props) => {
    const [data, setSrcData] = useState(() => {
        let initData = {
            root: {}
        };
        if (props.localize) {
            const dataText = sessionStorage.getItem(localKey);
            initData.root = dataText && !utils.isEmpty(dataText) ? JSON.parse(dataText) : {};
        }
        return initData;
    });
    const getData = useCallback((key) => {
        return key && !utils.isEmpty(key) ? utils.getValue(data.root, key) : Object.assign({}, data.root);
    }, [data]);
    const setData = useCallback((newData) => {
        const updateData = {
            root: Object.assign(Object.assign({}, data.root), newData)
        };
        setSrcData(updateData);
        if (props.localize) {
            sessionStorage.setItem(localKey, JSON.stringify(updateData.root));
        }
    }, [data, props]);
    return (_jsx(HocContext.Provider, Object.assign({ value: {
            getData,
            setData,
            data
        } }, { children: props.children }), void 0));
};
export const withContext = (options) => (ContextWrapper) => {
    if (typeof (options === null || options === void 0 ? void 0 : options.mapDispatchToProps) === "function") {
        if (utils.isEmpty(options.dataKey)) {
            throw new Error("当设置mapDispatchToProps时必须设置dataKey。");
        }
    }
    const withContextState = {
        dispatchs: null
    };
    return (props) => {
        const [timestamp, setTimestamp] = useState(Date.now());
        const [dataKey] = useState((options === null || options === void 0 ? void 0 : options.dataKey) || "");
        const contextRef = useContext(HocContext);
        const [mapState, setMapState] = useState(() => {
            if (typeof (options === null || options === void 0 ? void 0 : options.mapDataToProps) === "function") {
                return options.mapDataToProps(contextRef.getData(dataKey), contextRef.getData());
            }
            else {
                return {};
            }
        });
        const dispatch = useCallback((hoc) => {
            return (subDataKey, newValue) => {
                const updateData = Object.assign({}, hoc.getData(dataKey) || {});
                const updateRootData = {};
                updateData[subDataKey] = newValue;
                updateRootData[dataKey] = updateData;
                hoc.setData(updateRootData);
                if (typeof (options === null || options === void 0 ? void 0 : options.mapDataToProps) === "function") {
                    const mapStateData = options.mapDataToProps(contextRef.getData(dataKey), contextRef.getData());
                    setMapState(mapStateData);
                }
                else {
                    setMapState(updateData);
                }
                setTimestamp(Date.now());
            };
        }, [dataKey, setMapState, setTimestamp, contextRef]);
        const createDispatch = useCallback((fn, data) => {
            const dispatchs = fn(dispatch(data), data);
            if (!dispatchs) {
                throw new Error("mapDispatchToProps必须返回绑定方法对象。");
            }
            withContextState.dispatchs = dispatchs;
            return dispatchs;
        }, [dispatch]);
        const mapDispatch = useMemo(() => {
            return !withContextState.dispatchs && (options === null || options === void 0 ? void 0 : options.mapDispatchToProps) ? createDispatch(options === null || options === void 0 ? void 0 : options.mapDispatchToProps, contextRef) : withContextState.dispatchs;
        }, [createDispatch, contextRef]);
        const formatMapData = useMemo(() => {
            return mapState || ((options === null || options === void 0 ? void 0 : options.mapDataToProps) && options.mapDataToProps(contextRef.getData(dataKey), contextRef.getData()));
        }, [mapState, dataKey, contextRef]);
        // console.log(formatMapData());
        return (_jsx(ContextWrapper, Object.assign({ timestamp: timestamp }, props, mapDispatch, { contextData: formatMapData, context: contextRef }), void 0));
    };
};
export default withContext;

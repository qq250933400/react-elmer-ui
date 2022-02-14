import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useMemo } from "react";
import styles from "./style.module.scss";
import Loading from "antd-mobile/es/components/loading";
import Result from "antd-mobile/es/components/result";
import UndoOutline from "antd-mobile-icons/es/UndoOutline";
import LeftOutline from "antd-mobile-icons/es/LeftOutline";
import { useNavigate, useLocation } from "react-router-dom";
import { utils } from "elmer-common";
const WithFrameContext = React.createContext({
    data: {},
    setData: () => { }
});
const withFrame = (options) => {
    const withFrameState = {
        isInit: false
    };
    return (WrapperComponent) => {
        if (!options.onHome) {
            options.onHome = (opt) => {
                opt.navigateTo("/profile");
            };
        }
        if (!options.onHistory) {
            options.onHistory = (opt) => {
                opt.navigateTo("/history");
            };
        }
        return (props) => {
            const location = useLocation();
            const [loading, setLoading] = useState({
                visible: utils.isBoolean(options.showLoading) ? options.showLoading : false,
                mount: false
            });
            const [loadingText, setLoadingText] = useState(options.loadingText || "加载数据");
            const [optData, setOptData] = useState({});
            const [title] = useState(() => {
                return typeof options.title === "function" ? options.title(props) : options.title;
            });
            const [errInfo, setErrInfo] = useState({
                show: false,
                title: "无法完成操作",
                message: "未知错误信息，请联系客服。",
            });
            const navigateTo = useNavigate();
            const exProps = useMemo(() => ({
                showLoading: (opt) => {
                    if ((opt === null || opt === void 0 ? void 0 : opt.title) && !utils.isEmpty(opt === null || opt === void 0 ? void 0 : opt.title)) {
                        setLoadingText(opt.title);
                    }
                    setLoading({
                        visible: true,
                        mount: utils.isBoolean(opt === null || opt === void 0 ? void 0 : opt.mount) ? opt === null || opt === void 0 ? void 0 : opt.mount : false
                    });
                },
                hideLoading: () => setLoading({
                    visible: false,
                    mount: false
                }),
                setData: (newData) => setOptData(Object.assign(Object.assign({}, optData), (newData || {}))),
                showError: (info) => setErrInfo({
                    show: true,
                    title: info.title || "操作失败",
                    message: info.message
                }),
                hideError: () => setErrInfo({
                    show: false,
                    title: "",
                    message: ""
                }),
                navigateTo: (to, options) => navigateTo(to, options)
            }), [navigateTo, optData]);
            const apiProps = useMemo(() => (Object.assign(Object.assign({}, exProps), { init: () => {
                    typeof options.onInit === "function" && options.onInit(Object.assign(Object.assign({}, props), exProps));
                } })), [props, exProps]);
            const contextValues = useMemo(() => {
                return {
                    data: optData,
                    setData: (newData) => {
                        setOptData(Object.assign(Object.assign({}, optData), (newData || {})));
                    }
                };
            }, [optData]);
            useEffect(() => {
                !withFrameState.isInit && typeof options.onInit === "function" && options.onInit(Object.assign(Object.assign({}, props), exProps));
                withFrameState.isInit = true;
            }, [props, exProps]);
            useEffect(() => {
                const oldLocation = sessionStorage.getItem("location");
                if (!utils.isEmpty(oldLocation) && oldLocation !== location.pathname) {
                    // 此处主要为防止withFrame这个component不被销毁重建，和React选择逻辑有关
                    typeof options.onInit === "function" && options.onInit(Object.assign(Object.assign({}, props), exProps));
                }
                sessionStorage.setItem("location", location.pathname);
            }, [location, props, exProps]);
            return _jsx(WithFrameContext.Provider, Object.assign({ value: contextValues }, { children: _jsxs("div", Object.assign({ className: styles.withFramePage }, { children: [_jsxs("header", { children: [!loading.visible && !errInfo.show && _jsx("button", { className: styles.btnHome, onClick: () => { typeof options.onHome === "function" && options.onHome(apiProps, props); } }, void 0),
                                !loading.visible && errInfo.show && (_jsxs("button", Object.assign({ className: styles.btnCancel, onClick: () => {
                                        apiProps.hideError();
                                        typeof options.onCancel === "function" && options.onCancel(apiProps, props);
                                    } }, { children: [_jsx(LeftOutline, {}, void 0), _jsx("span", { children: "\u53D6\u6D88" }, void 0)] }), void 0)),
                                _jsx("span", { children: title || "" }, void 0),
                                !loading.visible && !errInfo.show && _jsx("button", { className: styles.btnHistory, onClick: () => { typeof options.onHistory === "function" && options.onHistory(apiProps, props); } }, void 0),
                                !loading.visible && errInfo.show && (_jsxs("button", Object.assign({ className: styles.btnRetry, onClick: () => {
                                        apiProps.hideError();
                                        typeof options.onRetry === "function" && options.onRetry(apiProps, props);
                                    } }, { children: [_jsx(UndoOutline, {}, void 0), _jsx("span", { children: "\u91CD\u8BD5" }, void 0)] }), void 0))] }, void 0),
                        _jsxs("div", Object.assign({ className: styles.withFramePageContent }, { children: [loading.visible && !errInfo.show && (_jsxs("div", Object.assign({ className: styles.fullLoading }, { children: [_jsx(Loading, { color: 'white' }, void 0),
                                        _jsx("span", { children: loadingText }, void 0)] }), void 0)),
                                errInfo.show && (_jsx(Result, { status: 'error', title: errInfo.title, description: errInfo.message, className: styles.exception }, void 0)),
                                (!loading.visible || loading.mount) && !errInfo.show && (_jsx("div", Object.assign({ style: { display: !loading.visible ? "block" : "none" } }, { children: _jsx(WrapperComponent, Object.assign({}, props, optData, exProps, { onInit: () => {
                                            typeof options.onInit === "function" && options.onInit(Object.assign(Object.assign({}, props), exProps));
                                        } }), void 0) }), void 0))] }), void 0)] }), void 0) }), void 0);
        };
    };
};
export default withFrame;

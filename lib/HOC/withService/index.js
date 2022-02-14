import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useState } from 'react';
import { createServiceConfig, ElmerService } from "./ElmerService";
import { getServiceObj } from "elmer-common/lib/decorators/Autowired";
import { commonHandler } from "./ErrorHandle";
import { useNavigate } from "react-router-dom";
export const createConfig = createServiceConfig;
export const ServiceContext = createContext({
    config: {},
    env: "DEV"
});
export const ServiceProvider = (props) => {
    return (_jsx(ServiceContext.Provider, Object.assign({ value: {
            config: props.data,
            env: props.env
        } }, { children: props.children }), void 0));
};
const withService = () => {
    return (SerivceWrapper) => {
        return (props) => {
            const [serviceObj] = useState(() => {
                return getServiceObj(ElmerService);
            });
            const navigateTo = useNavigate();
            const sendRequest = useCallback((option, opt) => {
                return new Promise((resolve, reject) => {
                    const token = sessionStorage.getItem("token");
                    const handleEvent = {
                        throwException: opt === null || opt === void 0 ? void 0 : opt.throwException
                    };
                    serviceObj.send(Object.assign(Object.assign({}, option), { cookie: Object.assign(Object.assign({}, (option.cookie || {})), { token }) })).then((resp) => {
                        var _a, _b, _c;
                        handleEvent.onError = (err) => {
                            reject(Object.assign(Object.assign({}, resp), { statusCode: err.statusCode, message: err.message }));
                        };
                        if (!commonHandler(resp, false, handleEvent)) {
                            resolve(resp.data);
                        }
                        else {
                            reject(Object.assign(Object.assign({}, resp), { statusCode: (_a = resp.data) === null || _a === void 0 ? void 0 : _a.statusCode, message: (_b = resp.data) === null || _b === void 0 ? void 0 : _b.message }));
                        }
                        if (((_c = handleEvent.returnValue) === null || _c === void 0 ? void 0 : _c.statusCode) === "NoLogin") {
                            navigateTo("/login");
                        }
                    }).catch((err) => {
                        var _a;
                        handleEvent.onError = (errx) => {
                            reject(Object.assign(Object.assign({}, err), { statusCode: errx.statusCode, message: errx.message }));
                        };
                        commonHandler(err, true, handleEvent);
                        if (((_a = handleEvent.returnValue) === null || _a === void 0 ? void 0 : _a.statusCode) === "NoLogin") {
                            navigateTo("/login");
                        }
                        reject(err);
                    });
                });
            }, [serviceObj]);
            return (_jsx(ServiceContext.Consumer, { children: data => {
                    serviceObj.setENV(data.env);
                    serviceObj.setConfig(data.config);
                    return _jsx(SerivceWrapper, Object.assign({}, props, { serviceConfig: data, service: {
                            send: sendRequest
                        } }), void 0);
                } }, void 0));
        };
    };
};
export default withService;

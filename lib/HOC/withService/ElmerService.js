var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import axios from "axios";
import { utils, Service } from "elmer-common";
import { getServiceObj } from "elmer-common/lib/decorators/Autowired";
export const createServiceConfig = (data) => {
    return data;
};
// const [serviceState, withServiceContext,] = createContext("ElmerServiceContext", {
//     config: {}
// });
let ElmerService = class ElmerService {
    constructor() {
        this.config = {};
        // this.config = serviceState.config;
        this.env = "DEV";
    }
    setENV(env) {
        this.env = env;
    }
    setConfig(configData) {
        this.config = configData;
        // serviceState.config = configData;
    }
    setNamespace(namespace, data) {
        var _a;
        if ((_a = this.config) === null || _a === void 0 ? void 0 : _a.config) {
            this.config.config[namespace] = data;
        }
        else {
            this.config.config = {};
            this.config.config[namespace] = data;
        }
    }
    getConfig() {
        return this.config.config;
    }
    getEndPoint(endPointId) {
        var _a;
        const endArr = (endPointId || "").split(".");
        const namespace = endArr[0];
        const id = endArr[1];
        const allConfig = (_a = this.config) === null || _a === void 0 ? void 0 : _a.config;
        const namespaceData = allConfig ? allConfig[namespace] : null;
        if (namespaceData) {
            const endPointConfig = (namespaceData.endPoints || {})[id];
            if (endPointConfig) {
                const endPoint = JSON.parse(JSON.stringify(endPointConfig));
                const isDummy = this.config.isDummy || namespaceData.isDummy || endPoint.isDummy;
                const env = this.config.env || this.env || "PROD";
                const rootHost = (this.config.host || {})[env];
                const namespaceHost = (namespaceData.host || {})[env];
                const domainPath = namespaceHost || rootHost;
                let url = endPoint.url;
                if (utils.isObject(endPoint.url)) {
                    url = endPoint.url[env];
                }
                if (isDummy) {
                    url = endPoint.dummyData || url; // 如果未设置dummy数据路径，fallback回之前的设置
                }
                else {
                    url = domainPath + url;
                }
                if (utils.isObject(endPoint.uri)) { // 将自定义参数合并到连接
                    url = this.mergeLinkAndUri(url, endPoint.uri);
                }
                endPoint.url = url;
                return endPoint;
            }
        }
    }
    getUrl(endPointId) {
        const endPoint = this.getEndPoint(endPointId);
        return endPoint ? endPoint.url : null;
    }
    /**
     * 发送http请求
     * @param options - 请求参数
     * @param newEndPoint - 自定义API参数配置，不从全局配置数据去读取
     * @returns - 返回Promise对象
     */
    send(options, newEndPoint) {
        return new Promise((resolve, reject) => {
            const endPoint = newEndPoint || this.getEndPoint(options === null || options === void 0 ? void 0 : options.endPoint);
            if (!endPoint) {
                reject({
                    message: "The endpoint is not found.",
                    status: "IT-500"
                });
            }
            else {
                const sendData = Object.assign(Object.assign({}, (endPoint.data || {})), (options.data || {}));
                const url = utils.isObject(options.uri) ? this.mergeLinkAndUri(endPoint.url, options.uri) : endPoint.url;
                const type = endPoint.method || "GET";
                const headers = Object.assign(Object.assign({}, (endPoint.header || {})), (options.header || {}));
                const cookieData = Object.assign(Object.assign({}, (endPoint.cookie || {})), (options.cookie || {}));
                this.setCookies(cookieData);
                axios.request({
                    auth: endPoint.auth,
                    data: sendData,
                    headers,
                    method: type,
                    timeout: this.config.timeout || 30000,
                    url,
                    withCredentials: options.withCredentials || endPoint.withCredentials
                }).then((resp) => {
                    resolve({
                        config: endPoint,
                        data: resp.data,
                        endPoint,
                        headers: resp.headers,
                        options
                    });
                }).catch((error) => {
                    // tslint:disable-next-line: no-console
                    console.error(error);
                    reject(error);
                });
            }
        });
    }
    setCookies(cookieData) {
        if (cookieData) {
            Object.keys(cookieData).forEach((cookieKey) => {
                const value = cookieData[cookieKey];
                const setValue = utils.isObject(value) ? JSON.stringify(value) : value;
                const cookieValue = `${cookieKey}=${encodeURIComponent(setValue)}`;
                document.cookie = cookieValue;
            });
        }
    }
    /**
     * 将url和uri参数合并
     * @param url 源连接
     * @param uri 合并参数
     * @returns 合并后的链接
     */
    mergeLinkAndUri(url, uri) {
        const uriQuery = this.uriToQuery(uri);
        return !/\?/.test(url) ? url + "?" + uriQuery :
            (/#/.test(url) ? url.replace(/#/, "#" + uriQuery) :
                url + "&" + uriQuery);
    }
    uriToQuery(uri) {
        const rList = [];
        if (utils.isObject(uri)) {
            Object.keys(uri).forEach((item) => {
                const itemValue = uri[item];
                const itemV = utils.isObject(itemValue) ? JSON.stringify(itemValue) : itemValue;
                const itemQV = encodeURIComponent(itemV);
                rList.push(`${item}=${itemQV}`);
            });
        }
        return rList.join("&");
    }
};
ElmerService = __decorate([
    Service
], ElmerService);
export { ElmerService };
export const GetUrl = (endPoint) => {
    return (target, attr) => {
        const obj = getServiceObj(ElmerService);
        const myUrl = obj.getUrl(endPoint);
        if (target) {
            Object.defineProperty(target, attr, {
                get: () => myUrl,
                set: () => { throw new Error(`The property of ${attr} cannot be modified directly.`); }
            });
        }
        return myUrl;
    };
};
export const GetEndPoint = (endPoint) => {
    return (target, attr) => {
        const obj = getServiceObj(ElmerService);
        const myEndPoint = obj.getEndPoint(endPoint);
        if (target) {
            Object.defineProperty(target, attr, {
                get: () => myEndPoint,
                set: () => { throw new Error(`The property of ${attr} cannot be modified directly.`); }
            });
        }
        return myEndPoint;
    };
};
export const SetServiceConfig = () => {
    return (target, attr, defaultValue) => {
        const obj = getServiceObj(ElmerService);
        obj.setConfig(defaultValue);
        if (target) {
            Object.defineProperty(target, attr, {
                get: () => defaultValue,
                set: () => { throw new Error(`The property of ${attr} cannot be modified directly.`); }
            });
        }
    };
};
export const SetServiceNamespace = (namespace) => {
    return (target, attr, descriptor) => {
        const obj = getServiceObj(ElmerService);
        const configData = descriptor.value();
        obj.setNamespace(namespace, configData);
    };
};

import { utils } from "elmer-common/lib/utils";

export const cn = (...args:any[]): string => {
    const strArr: any[] = [];
    for(const str of args) {
        if(!utils.isEmpty(str)) {
            strArr.push(str);
        }
    }
    return strArr.join(" ");
}
/**
 * 调用方法返回一个promise, 如果返回结果不是Promise对象也返回Promise对象，某些特殊情况需要兼容两种结果
 * @param fn - 自定义方法
 * @param args - 传递参数
 * @returns 
 */
export const invoke = <T={}>(fn: Function, ...args: any[]): Promise<T> => {
    return new Promise((resolve, reject) => {
        const fnResult = fn(...args);
        if(utils.isPromise(fnResult)) {
            fnResult.then(resolve).catch(reject);
        } else {
            resolve(fnResult);
        }
    });
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    cn
};

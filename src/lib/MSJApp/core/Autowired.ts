import { getModelObj, getServiceObj } from "elmer-common/lib/decorators/Autowired";
import { DECORATORS_CLASS_TYPE, DECORATORS_CLASS_TYPE_MODEL, DECORATORS_CLASS_TYPE_SERVICE } from "elmer-common/lib/decorators/base";

export const Autowired = (TargetFactory: new(...vargs:[])=>any, ...args:any[]) => {
    return (target: any, attrKey: string) => {
        Object.defineProperty(target, attrKey, {
            configurable: false,
            enumerable: true,
            get: () => {
                const type = Reflect.getMetadata(DECORATORS_CLASS_TYPE, TargetFactory);
                let obj = null;
                if(type === DECORATORS_CLASS_TYPE_SERVICE) {
                    obj = getServiceObj(TargetFactory, ...args);
                } else if(type === DECORATORS_CLASS_TYPE_MODEL) {
                    obj = getModelObj(TargetFactory, ...args);
                } else {
                    throw new Error(`(${TargetFactory.name})当前模块注册类型不适合使用Autowired初始化.`);
                }
                return obj;
            },
            set: () => {
                throw new Error("使用Autowired初始化的对象不允许重写.");
            }
        });
    }
};
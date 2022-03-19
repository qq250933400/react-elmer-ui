import { createInstance, Model, MLoader, asynData } from "../lib/MSJApp";
import { AppImpl } from "./AppImpl";

class TestModel extends Model {
    say(a: string, b: string): void {
        console.log("say", a,b);
    }
}
const AsynModel = MLoader(()=> import("./AsynModel"));

asynData("test", ()=>import(/** webpackChunkName: AsyncTest */"./test.json"));

type ModelData = {
    test: TestModel;
    asyn: typeof AsynModel;
};
type AttachApi = {
    hello(): void;
};

export const app = createInstance<ModelData, AttachApi>(AppImpl, {
    models: {
        test: TestModel,
        asyn: AsynModel
    },
    attachApi: {
        hello: () => () => {
            console.log("call hello api");
        }
    }
});

app.hello()
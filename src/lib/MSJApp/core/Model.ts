import { Api } from "./Api";

export const ModelFlag = "MSJ_App_Model_202203191208";

export class Model<UseModel={}, AttachApi={}> {
    public static flag: string = ModelFlag;
    public api: Api<UseModel> & AttachApi
    constructor(api: Api<UseModel> & AttachApi) {
        this.api = api;
    }
}
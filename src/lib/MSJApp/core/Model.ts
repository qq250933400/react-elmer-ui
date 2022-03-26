import { Api } from "./Api";
import { TypeAttachApi } from "./AttachApi";

export const ModelFlag = "MSJ_App_Model_202203191208";

export class Model<UseModel={}, AttachApi={}, EventHandler={}> {
    public static flag: string = ModelFlag;
    public api: Api<UseModel, EventHandler> & AttachApi & TypeAttachApi;
    constructor(api: Api<UseModel> & AttachApi & TypeAttachApi) {
        this.api = api;
    }
}
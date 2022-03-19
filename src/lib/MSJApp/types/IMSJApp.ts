import { Model } from "../core/Model";
import { Api } from "../core/Api";

export interface IMSJAppOptions<M={}, TP={}> {
    attachApi?: {[P in keyof TP]: (api: Api) => Function };
    models?: {[P in keyof M]: Model};
}

export interface IMSJAppRunOpt {
    location: string;
}
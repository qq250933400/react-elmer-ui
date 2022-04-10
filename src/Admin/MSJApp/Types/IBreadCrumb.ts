import { IPageInfoEx } from "./IPageInfoEx";

export interface IBreadCrumb {
    title: string;
    page?: IPageInfoEx;
}

export interface IBreadCrumbList extends Array<IBreadCrumb> {

}
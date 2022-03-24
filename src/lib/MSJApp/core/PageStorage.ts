import { utils } from "elmer-common";
import { IPageInfo } from "../types/IPage";

type TypeCreatePageFromInfo<T> =  {[P in Exclude<keyof T, "path">]?: T[P] } & { id: string; };
type TypeCreatePage = <T={}>(pageInfo: IPageInfo & T) => TypeCreateWorkspaceResult;
type TypeCreatePageFrom = <T={}>(pageId: string, pageInfo: TypeCreatePageFromInfo<IPageInfo> & T) => TypeCreateWorkspaceResult;
type TypeCreateWorkspaceResult = {
    createPage: TypeCreatePage;
    createPageFrom: TypeCreatePageFrom;
};

const pageState:any = {};

export const CONSTPAGEDATAKEY = "MSJApp_Page_storage_202203341951";
/**
 * 根据页面ID获取配置数据
 * @param pageId 页面ID
 * @returns 
 */
export const getPageById = <T={}>(pageId: string): (IPageInfo & T) | null => {
    const idRegExp = /^([a-z0-9_]{1,})\.([a-z0-9_])$/i;
    const idM = idRegExp.exec(pageId);
    if(idM) {
        const workspace = idM[1];
        const myPageId = idM[2];
        if(pageState[workspace]) {
            if(pageState[workspace][myPageId]) {
                return pageState[workspace][myPageId];
            } else {
                throw new Error(`指定页面ID在workspace(${workspace})下不存在。`);
            }
        } else {
            throw new Error(`指定workspace(${workspace})不存在。`);
        }
    } else {
        throw new Error("请指定workspace名称。");
    }
};
/**
 * 创建workspace
 * @param name - workspace name
 * @returns 
 */
export const createWorkspace = (name: string): TypeCreateWorkspaceResult => {

    if(pageState[name]) {
        throw new Error(`创建Workspace失败名称已存在。(${name})`);
    }
    const workspace:any = {};
    pageState[name] = workspace;
    const myworkspace = {
        createPage: <T={}>(pageInfo: IPageInfo & T) => {
            if(!workspace[pageInfo.id]) {
                workspace[pageInfo.id] = pageInfo;
            } else {
                throw new Error(`定义PageId已经存在，请检查配置（${pageInfo.id}）`);
            }
            return {
                createPage: myworkspace.createPage,
                createPageFrom: myworkspace.createPageFrom
            };
        },
        createPageFrom: <T={}>(pageId: string, pageInfo: TypeCreatePageFromInfo<IPageInfo> & T) => {
            const oldPageInfo = getPageById(pageId) || getPageById([name, pageId].join("."));
            if(!oldPageInfo) {
                throw new Error(`指定的pageId不存在。(${pageId})`);
            } else {
                if(utils.isEmpty(pageInfo.id)) {
                    throw new Error("创建新的页面ID不能为空。");
                }
                if(pageState[name][pageInfo.id]) {
                    throw new Error(`创建页面的ID已经存在，请检查设置。(${pageInfo.id})`);
                }
                pageState[name][pageInfo.id] = {
                    ...oldPageInfo,
                    ...pageInfo
                };
            }
            return {
                createPage: myworkspace.createPage,
                createPageFrom: myworkspace.createPageFrom
            };
        }
    }
    return myworkspace;
};

export const getWorkspace = (name: string): any => {
    return pageState[name];
};

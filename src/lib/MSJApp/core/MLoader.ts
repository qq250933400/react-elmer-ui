type TypeLoader = () => Promise<any>;

export type TypeLoaderResult = {
    flag: string;
    load: () => Promise<any>
};

export const loaderFlag = "MSJ_App_loader_202203191208";

export const MLoader = <T={}>(loader: TypeLoader): T => {
    return {
        flag: loaderFlag,
        load: () => loader()
    } as any;
};
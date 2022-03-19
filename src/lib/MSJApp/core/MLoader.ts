type TypeLoader = () => Promise<any>;

export type TypeLoaderResult = {
    flag: string;
    load: () => Promise<any>
};

export const loaderFlag = "MSJ_App_loader_202203191208";

export const MLoader = (loader: TypeLoader): any => {
    return {
        flag: loaderFlag,
        load: () => loader()
    };
};
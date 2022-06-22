import loadable from "@Component/Loadable";
import { createWorkspace, createInstance } from "@MSJApp";
import React from "react";
import { EditAppImpl } from "./EditAppImpl";
import { UseModel, TypeModels } from "./model";
import { TypeApi, TypeApiEvent, Api } from "./api/index";

const Portal = loadable({
    loader: () => import(/* webpackChunkName: 'PageEditor_Portal' */"../Portal")
});

const App = loadable({
    loader: () => import(/* webpackChunkName: 'PageEditor_App' */"../App")
});

type TypeEditAppPageInfo = {
    Component: React.ComponentType<any>
};

export const worksapce = createWorkspace<TypeEditAppPageInfo>("PageEditApplicaton")
    .createPage({
        id: "portal",
        path: "/portal",
        Component: Portal
    }).createPage({
        id: "app",
        path: "/app",
        onBeforeEnter: "app.onBeforeAppInit",
        Component: App
    });

export const editApp = createInstance<TypeModels, TypeApi, TypeApiEvent>(EditAppImpl, {
    models: UseModel,
    attachApi: Api
});

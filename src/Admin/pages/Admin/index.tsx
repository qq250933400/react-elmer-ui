import React, { useState, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { AdminPages } from "../index";
import { msjApi } from "@Admin/MSJApp";
import styles from "./style.module.scss";

import "antd/dist/antd.css";
import AdminLayout from "./Layout";

const complexMenus = [
    {
        path: "/home",
        name: "首页",
        locale: "menu.home",
        routes: [
            {
                path: "/home/overview",
                name: "概述",
                hideInMenu: true,
                locale: "menu.home.overview"
            }, {
                path: "/home/search",
                name: "搜索",
                hideInMenu: true,
                locale: "menu.home.search"
            }
        ]
    }
];

const Admin = () => {
    const [ urlPrefix ] = useState(msjApi.urlPrefix);
    const [ collapsed, setCollapsed ] = useState(false);
    const [ position, setPosition ] = useState<'header'|'menu'>('header');
  
    return (
        <div className={styles.admin_layout}>
            <AdminLayout />
        </div>
    );
    // return (
    //     <div className={styles.admin_layout}>
    //         <span>Hello admin</span>
    //         <div>
    //             <Routes>
    //                 {
    //                     AdminPages.map((info, index) => {
    //                         const pathname = [urlPrefix, info.path].join("/").replace(/([\/]{2,})/,"/");
    //                         const AComponent = info.component;
    //                         return <Route key={`admin_page_${index}`} path={pathname} element={<AComponent />}/>
    //                     })
    //                 }
    //             </Routes>
    //         </div>
    //     </div>
    // );
};

export default Admin;

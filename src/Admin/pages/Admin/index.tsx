import React, { useEffect, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import styles from "./style.module.scss";

import "antd/dist/antd.css";
import AdminLayout from "./Layout";
import { useConfig } from "../../hooks";
import { adminWorkspace } from "@Admin/data/page";
import { AdminPages } from "../index";

const Admin = () => {
    const overrideConfig = useConfig();
    const urlPrefix = useMemo(() => {
        return (overrideConfig.urlPrefix || "/") + "admin/";
    }, [overrideConfig]);
    useEffect(() => {
        AdminPages.forEach((page) => {
            const pagePath = [urlPrefix, page.path].join("/").replace(/([\/]{2,})/, "/");
            adminWorkspace.createPage({
                id: page.id,
                path: pagePath,
                title: page.title
            });
        });
    }, [urlPrefix]);
    return (
        <div className={styles.admin_layout}>
            <AdminLayout>
                <Routes>
                    {
                        AdminPages.map((info, index) => {
                            const pathname = [urlPrefix, info.path].join("/").replace(/([\/]{2,})/,"/");
                            const AComponent = info.component;console.log("path:", pathname);
                            return <Route key={`admin_page_${index}`} path={pathname} element={<AComponent />}/>
                        })
                    }
                </Routes>
            </AdminLayout>
        </div>
    );
};

export default Admin;

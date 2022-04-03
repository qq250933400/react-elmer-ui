import React, { useEffect, useMemo } from "react";
import { Routes, Route, MemoryRouter as Router } from "react-router-dom";
import styles from "./style.module.scss";

import "antd/dist/antd.css";
import AdminLayout from "./Layout";
import { useConfig } from "../../hooks";
import { adminWorkspace } from "@Admin/data/page";
import { AdminPages } from "../index";

const adminState = {};

const Admin = () => {
    const overrideConfig = useConfig();
    const urlPrefix = useMemo(() => {
        return (overrideConfig.urlPrefix || "/") + "admin/";
    }, [overrideConfig]);
    useEffect(() => {
        if(!overrideConfig.initConfig) {
            overrideConfig.initConfig = true;
            AdminPages.forEach((page) => {
                const pagePath = [urlPrefix, page.path].join("/").replace(/([\/]{2,})/, "/");
                const newPage = {...page};
                delete newPage.component;
                adminWorkspace.createPage({
                    ...newPage,
                    navigateTo: pagePath,
                    isAdminPage: true
                });
            });
        }
    }, [overrideConfig, urlPrefix]);
    return (
        <div className={styles.admin_layout}>
            <AdminLayout>
                <Routes>
                    {
                        AdminPages.map((info, index) => {
                            const AComponent = info.component;
                            return <Route key={`admin_page_${index}`} path={info.path} element={<AComponent />}/>
                        })
                    }
                </Routes>
            </AdminLayout>
        </div>
    );
};

export default Admin;

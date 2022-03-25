import React, { useState, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { AdminPages } from "../index";
import { msjApi } from "@Admin/MSJApp";
import styles from "./style.module.scss";

import "antd/dist/antd.css";
import AdminLayout from "./Layout";

const Admin = () => {
    const [ urlPrefix ] = useState(msjApi.urlPrefix);
  
    return (
        <div className={styles.admin_layout}>
            <AdminLayout>
                <Routes>
                    {
                        AdminPages.map((info, index) => {
                            const pathname = [urlPrefix, info.path].join("/").replace(/([\/]{2,})/,"/");
                            const AComponent = info.component;
                            return <Route key={`admin_page_${index}`} path={pathname} element={<AComponent />}/>
                        })
                    }
                </Routes>
            </AdminLayout>
        </div>
    );
};

export default Admin;

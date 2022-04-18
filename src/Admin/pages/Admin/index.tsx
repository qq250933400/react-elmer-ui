import React from "react";
import { Routes, Route} from "react-router-dom";
import styles from "./style.module.scss";

import "antd/dist/antd.css";
import AdminLayout from "./Layout";
import { AdminPages } from "../index";


const Admin = () => {

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

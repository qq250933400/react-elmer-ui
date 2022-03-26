import { msjApi } from "../MSJApp";

msjApi.createMenu("adminLeftMenu", [
    {
        pageId: "adminMain",
        title: "首页"
    },
    {
        pageId: "#",
        title: "设置",
        subMenu: [
            {
                pageId: "admin_landing",
                title: "权限管理"
            }, {
                pageId: "adminMenu",
                title: "系统菜单"
            }
        ]
    }
]);

// eslint-disable-next-line import/no-anonymous-default-export
export default {};
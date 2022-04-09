import { msjApi } from "../MSJApp";
import {
    UserOutlined, PoweroffOutlined, HomeOutlined,
    SettingOutlined, ToolOutlined, UnorderedListOutlined,
    FlagOutlined, HddOutlined, FundViewOutlined, FileTextOutlined
} from "@ant-design/icons";

msjApi.createMenu("adminLeftMenu", [
    {
        value: "adminMain",
        title: "homePage",
        icon: HomeOutlined
    },
    {
        value: "#",
        title: "setting",
        icon: SettingOutlined,
        subMenu: [
            {
                value: "admin_rights",
                title: "accessRight",
                icon: ToolOutlined
            }, {
                value: "adminMenu",
                title: "sysMenu",
                icon: UnorderedListOutlined
            }
        ]
    }, {
        value: "#",
        title: "resource",
        icon: HddOutlined,
        subMenu: [
            {
                value: "adminPages",
                title: "resource_page_mg",
                icon: FundViewOutlined
            }, {
                value: "admin_lang",
                title: "resource_lang",
                icon: FileTextOutlined
            }
        ]
    }
]);

msjApi.createMenu("adminProfileMenu", [
    {
        title: "userInfo",
        value: "adminUserProfile",
        icon: UserOutlined
    }, {
        title: "language",
        value: "admin.switchLang",
        icon: FlagOutlined,
        type: "Api"
    },{
        title: "logout",
        type: "Api",
        value: "admin.logout",
        icon: PoweroffOutlined
    }
]);

// eslint-disable-next-line import/no-anonymous-default-export
export default {};
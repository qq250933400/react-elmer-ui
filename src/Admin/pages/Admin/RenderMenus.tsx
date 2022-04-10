import React from "react";
import { FormattedMessage } from "react-intl";
import { Menu } from "antd";
import { IMenuList } from "@MSJApp/types/IAdmin";
const { SubMenu } = Menu;

const IconMenuExtend = () => {
    return <i />
};

export const renderMenuList = (menuList: IMenuList, parentKey: string, fn: Function, subFn?: Function) => {
    return (
        menuList.map((item, mIndex):any => {
            if(null === item.visible || undefined === item.visible || (typeof item.visible === "boolean" && item.visible)) {
                const Icon = item.icon || IconMenuExtend;
                const itemKey = [parentKey, mIndex].join("_");
                (item as any).key = itemKey;
                if(item.subMenu && item.subMenu.length > 0) {
                    return <SubMenu onTitleClick={() => typeof subFn === "function" && subFn(item)} key={itemKey} icon={<Icon />} title={<FormattedMessage id={item.title}/>}>
                        {renderMenuList(item.subMenu, [parentKey, mIndex].join("_"), fn, subFn)}
                    </SubMenu>
                } else {
                    return  <Menu.Item onClick={() => typeof fn === "function" && fn(item)} key={itemKey} icon={<Icon />}>{<FormattedMessage id={item.title}/>}</Menu.Item>;
                }
            } else {
                return <></>
            }
        })
    );
};
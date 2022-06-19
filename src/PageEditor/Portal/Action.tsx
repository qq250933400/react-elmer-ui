/* eslint-disable react-hooks/exhaustive-deps */
import { FileAddOutlined, FolderOpenOutlined } from "@ant-design/icons";
import { FormattedMessage } from "@HOC/withI18n";
import { cn } from "src/utils";
import { Section } from "./Section";
import { editApp } from "../config";
import styles from "./style.module.scss";
import { useEffect, useMemo } from "react";
import { useService } from "@HOC/withService";
import { useStore } from "./DataStore";

type TypeActionButtonProps = {
    icon: any;
    title: any;
    onClick?: Function;
};
type TypeActionLinkProps = {
    title: any;
    description?: any;
    onClick?: Function;
};

const ActionButton = ({ icon, title, onClick }: TypeActionButtonProps) => {
    return (
        <label className="FocusTextColor" onClick={onClick as any}>
            {icon}
            <span className={styles.actionTitle}>{title}</span>
        </label>
    );
};
const ActionLink = ({title, description, onClick}: TypeActionLinkProps) => {
    return (
        <label className={styles.actionLinkButton} onClick={onClick as any}>
            <span className="FocusTextColor">{title}</span>
            <span className={cn(styles.actionTitle, "TitleColor")}>{description}</span>
        </label>
    );
}

export const ActionButtonSection = () => {
    return (
        <Section title={<FormattedMessage id="start"/>}>
            <ActionButton
                onClick={() => editApp.callApi("portal","onCreateFile")}
                icon={<FileAddOutlined />}
                title={<FormattedMessage id="addNewFile"/>}
            />
            <ActionButton
                icon={<FolderOpenOutlined />}
                title={<FormattedMessage id="openFile"/>}
                onClick={() => editApp.callApi("portal", "onOpenFile")}
            />
        </Section>
    );
};

export const ActionLinkSection = () => {
    const service = useService();
    const storeData = useStore(["openHistory"]);
    const historyData = useMemo(() => (storeData.data.openHistory || []), [storeData.data]);
    useEffect(() => {
        editApp.showLoading();
        service.send({
            endPoint: "editor.recent"
        }).then((resp) => {
            storeData.action.openHistory(resp);
            editApp.hideLoaidng();
        }).catch((err) => {
            editApp.hideLoaidng();
        });
    }, []);

    return (
        <Section title={<FormattedMessage id="recent"/>}>
            {
                historyData.map((item, index) => {
                    return (<ActionLink key={index} title={item.name} description={item.path}/>)
                })
            }
            <ActionLink title={<FormattedMessage id="more"/>}/>
        </Section>
    );
};
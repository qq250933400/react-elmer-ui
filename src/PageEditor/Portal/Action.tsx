import { FileAddOutlined, FolderOpenOutlined } from "@ant-design/icons";
import { FormattedMessage } from "@HOC/withI18n";
import { cn } from "src/utils";
import { Section } from "./Section";
import { editApp } from "../config";
import styles from "./style.module.scss";

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
    return (
        <Section title={<FormattedMessage id="recent"/>}>
            <ActionLink title="CommonPage" description="/mnt/page"/>
            <ActionLink title={<FormattedMessage id="more"/>}/>
        </Section>
    );
};
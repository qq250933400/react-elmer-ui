import { FileAddOutlined, FolderOpenOutlined } from "@ant-design/icons";
import { FormattedMessage } from "@HOC/withI18n";
import { cn } from "src/utils";
import { Section } from "./Section";
import styles from "./style.module.scss";

type TypeActionButtonProps = {
    icon: any;
    title: any;
};
type TypeActionLinkProps = {
    title: any;
    description?: any;
};

const ActionButton = ({ icon, title }: TypeActionButtonProps) => {
    return (
        <label className="FocusTextColor">
            {icon}
            <span className={styles.actionTitle}>{title}</span>
        </label>
    );
};
const ActionLink = ({title, description}: TypeActionLinkProps) => {
    return (
        <label className={styles.actionLinkButton}>
            <span className="FocusTextColor">{title}</span>
            <span className={cn(styles.actionTitle, "TitleColor")}>{description}</span>
        </label>
    );
}

export const ActionButtonSection = () => {
    return (
        <Section title={<FormattedMessage id="start"/>}>
            <ActionButton icon={<FileAddOutlined />} title={<FormattedMessage id="addNewFile"/>}/>
            <ActionButton icon={<FolderOpenOutlined />} title={<FormattedMessage id="openFile"/>}/>
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
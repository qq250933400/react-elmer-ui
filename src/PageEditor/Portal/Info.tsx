import { Section } from "./Section";
import { NotifyCard } from "../components/NotifyCard";
import styles from "./style.module.scss";
import { Html5Outlined } from "@ant-design/icons";

export const Info = () => {
    return (
        <Section title="通知">
            <div className={styles.notifyContainer}>
                <NotifyCard title="最新发布" description="发布通知信息"/>
                <NotifyCard title="支持插件" description="增加自定义插件支持" iconMode icon={<Html5Outlined />} showProgress progressMax={200} progressValue={50}/>
            </div>
        </Section>
    );
};

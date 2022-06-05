import styles from "./style.module.scss";
import { ActionButtonSection, ActionLinkSection } from "./Action";
import { FormattedMessage } from "@HOC/withI18n";
import { Info } from "./Info";
import { cn } from "src/utils";
import { Window } from "../components/Window";

const Portal = () => {
    return (<div className={cn(styles.portal, "Container")}>
        <div>
            <h1 className={cn(styles.title, "TitleColor")}><FormattedMessage id="applicationTitle"/></h1>
            <div className={styles.actionLayout}>
                <section className={styles.actionLayoutLeft}>
                    <ActionButtonSection />
                    <ActionLinkSection />
                </section>
                <section className={styles.actionLayoutSplit} />
                <section className={styles.actionLayoutRight}>
                    <Info />
                </section>
                <Window title="Web application" bottom={<button>CloseButton</button>} options={{
                    hideMax: false,
                    hideMin: true,
                }}>
                    <Info />
                </Window>
            </div>
        </div>
    </div>);
};

export default Portal;

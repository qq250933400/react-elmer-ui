import styles from "../style.module.scss";
import cn from "classnames";

const StatusBar = () => {
    return (
        <div className={cn(styles.statusBar, "StatusBar")}>
            <button>Hello</button>
            <button>Applicate</button>
        </div>
    );
};

export default StatusBar;
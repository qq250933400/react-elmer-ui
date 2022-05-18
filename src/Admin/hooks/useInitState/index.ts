import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export const useInitData = () => {
    const data = useLocation();
    return useMemo(() => {
        return data.state || {};
    },[data]);
};

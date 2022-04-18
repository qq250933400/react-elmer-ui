import { useInitData } from "@Admin/hooks";
import React from "react";

const Lang = () => {
    const data = useInitData();
    console.log(data);
    return <div>Hello Lang manage</div>
};

export default Lang;
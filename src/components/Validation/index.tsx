import React, { useState } from "react";
import { ValidationContext } from "./Context";

const Validation = (props: any) => {
    const [ validateState ] = useState({
        validators: {},
        validates: {}
    });
    return <ValidationContext.Provider value={validateState}>{props.children}</ValidationContext.Provider>
};

export default Validation;
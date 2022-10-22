import { isRequired } from "./isRequired";
import { Callback } from "./Callback";

export type TypeValidators = {
    isRequired: typeof isRequired;
    Callback: typeof Callback;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    isRequired,
    Callback
};

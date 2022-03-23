import Admin from "./Admin";
import FormData from "./FormData";

export type TypeModel = {
    admin: Admin;
    formData: FormData
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    admin: Admin,
    formData: FormData
};

import { TypeServiceConfig } from "../../HOC/withService/ElmerService";

type TypeAdminApi = {
    admin: {
        getLocales: string;
    }
}

export default ({
    env: ENV,
    host: {
        DEV: "http://localhost:8000"
    },
    config: {
        admin: {
            endPoints: {
                getLocales: {
                    url: "/lang/locales",
                    method: "GET"
                }
            }
        }
    }
}) as TypeServiceConfig<TypeAdminApi>;
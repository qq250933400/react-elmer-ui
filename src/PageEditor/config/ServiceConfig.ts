import { createService } from "@HOC/withService";


export const ServiceConfig = createService("Editor", {
    host: {
        "LOCAL": "http://localhost"
    },
    endPoints: {
        recent: {
            url: "/recent/files",
            method: "POST"
        }
    }
});


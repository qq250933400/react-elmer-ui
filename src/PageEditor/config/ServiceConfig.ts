import { createService } from "@HOC/withService";


export const ServiceConfig = createService("editor", {
    host: {
        "LOCAL": "http://localhost"
    },
    endPoints: {
        recent: {
            url: "/editor/recent/files",
            method: "GET"
        }
    }
});


import { msjApi } from "../MSJApp";



msjApi.registeConfig("sysInfo", {
    sysName: "sysName",
    sysShortName: "sysNameSH",
    notifyApi: null,
    notifyInterval: 3000
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {};

import { Model } from "@MSJApp";
import { TypeModels } from "./index";
import { TypeApi, TypeApiEvent } from "../api/index";

export default class Base extends Model<TypeModels, TypeApi, TypeApiEvent> {
    // the basic model
    public exitFullscreen() {
        if((document as any).exitFullScreen) {
            (document as any).exitFullScreen();
        } else if((document as any).mozCancelFullScreen) {
            (document as any).mozCancelFullScreen();
        } else if((document as any).webkitExitFullscreen) {
            (document as any).webkitExitFullscreen();
        } else if((document as any).msExitFullscreen) {
            (document as any).msExitFullscreen();
        }
    }
    public setFullScreen(ele:HTMLDivElement|Document) {
        if ((ele as any).requestFullscreen) {
            (ele as any).requestFullscreen();
        } else if ((ele as any).mozRequestFullScreen) {
            (ele as any).mozRequestFullScreen();
        } else if ((ele as any).webkitRequestFullscreen) {
            (ele as any).webkitRequestFullscreen();
        } else if ((ele as any).msRequestFullscreen) {
            (ele as any).msRequestFullscreen();
        }
    }
    
}
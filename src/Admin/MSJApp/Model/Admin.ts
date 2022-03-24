import { Model } from "../../../lib/MSJApp";

export default class Admin extends Model {
    say(): void {
        console.log("hello world");
    }
}
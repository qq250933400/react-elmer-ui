import { Model } from "../lib/MSJApp";

export default class AsyncModel extends Model {
    show(): void {
        this.api.callApi("test" as never,"say", "app", "info")
    }
}
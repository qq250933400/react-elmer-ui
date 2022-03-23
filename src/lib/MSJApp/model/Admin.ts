import { Model } from "../core/Model";

export default class Admin extends Model {
    test(): void {
         this.api.impl.getData();
    }
}

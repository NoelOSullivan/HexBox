import { Rotation } from "../../shared/interfaces/rotation";

export class ChangeRotation{
    static readonly type= '[New rotation to add] ChangeRotation';
    constructor(public rotation: Rotation){}
}
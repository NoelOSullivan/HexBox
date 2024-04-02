import { RotationToAdd, ActivePanelNumber } from "../../shared/interfaces/hexagon";

export class ChangeRotation {
    static readonly type= '[New rotation] ChangeRotation';
    constructor(public RotationToAdd: RotationToAdd){}
}

export class ChangePanelNumber {
    static readonly type= '[New panel number] ChangePanelNumber';
    constructor(public ActivePanelNumber: ActivePanelNumber){}
}
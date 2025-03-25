import { RotationToAdd, ActivePanelNumber, HexBoxInterface } from "../../shared/interfaces/hexagon";

export class ChangeRotation {
    static readonly type= '[New rotation] ChangeRotation';
    constructor(public RotationToAdd: RotationToAdd){}
}

export class ChangePanelNumber {
    static readonly type= '[New panel number] ChangePanelNumber';
    constructor(public ActivePanelNumber: ActivePanelNumber){}
}

export class ChangeHexBox {
    static readonly type= '[ChangeHexBox] ChangeHexBox';
    constructor(public HexBox: HexBoxInterface){}
}
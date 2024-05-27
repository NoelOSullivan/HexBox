import { Direction, DirectAccess } from "../../shared/interfaces/panel";

export class UpdatePageCounter {
    static readonly type= '[Change page info on content panel] UpdatePageCounter';
    constructor(public payload: { panelNumber: number; pageNumber: number }){}
}

export class InitPageTotals {
    static readonly type= '[Init page totals for content panels] InitPageTotals';
    constructor(public payload: { panelNumber: number; totalPages: number }){}
}

export class TurnPage {
    static readonly type= '[Turn page left or right] TurnPage';
    constructor(public Direction: Direction){}
}

export class AccessPanelDirect {
    static readonly type= '[Access a panel directly] Direct Access';
    constructor(public DirectAccess: DirectAccess){}
}


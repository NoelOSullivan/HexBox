export class UpdatePageCounter {
    static readonly type= '[Change page info on content panel] UpdatePageCounter';
    constructor(public payload: { panelNumber: number; pageNumber: number }){}
}

export class InitPageTotals {
    static readonly type= '[Init page totals for content panels] InitPageTotals';
    constructor(public payload: { panelNumber: number; totalPages: number }){}
}
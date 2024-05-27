import { PageCounters, Direction, DirectAccess } from "../../shared/interfaces/panel";

export class PageCounterModel {
    public pageCounters!: PageCounters;
}

export class PageTurnerModel {
    public direction!: Direction;
}

export class DirectAccessModel {
    public directAccess!: DirectAccess;
}
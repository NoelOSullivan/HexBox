import { Injectable } from '@angular/core';
import { State, Action, StateContext } from "@ngxs/store";

import { PageCounterModel, PageTurnerModel } from './panel.model';
import { UpdatePageCounter, InitPageTotals, TurnPage } from './panel.action';

@State<PageCounterModel>({
    name: 'pageCounters',
    defaults: {
        pageCounters: {
            counters: [1, 1, 1, 1, 1, 1],
            totals: [0, 0, 0, 0, 0, 0]
        },
    }
})

@Injectable()
export class PageCounters {
    constructor() { }
    @Action(UpdatePageCounter) updatePageCounter(ctx: StateContext<PageCounterModel>, { payload }: UpdatePageCounter) {
        let state = ctx.getState();
        let counters: [number, number, number, number, number, number] = [...state.pageCounters.counters];
        counters[payload.panelNumber - 1] = payload.pageNumber;
        ctx.setState({
            ...state,
            pageCounters: { counters: counters, totals: state.pageCounters.totals }
        });
    }

    @Action(InitPageTotals) initPageTotals(ctx: StateContext<PageCounterModel>, { payload }: InitPageTotals) {
        let state = ctx.getState();
        let totals: [number, number, number, number, number, number] = [...state.pageCounters.totals];
        totals[payload.panelNumber - 1] = payload.totalPages;
        ctx.setState({
            ...state,
            pageCounters: { counters: state.pageCounters.counters, totals: totals }
        });
    }
}

@State<PageTurnerModel>({
    name: 'pageTurner',
    defaults: {
        direction: {
            direction: "none",
        },
    }
})

@Injectable()
export class PageTurner {
    constructor() { }
    @Action(TurnPage) turnPage(ctx: StateContext<PageTurnerModel>, action: TurnPage) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            direction: action.Direction
        })
    }
}
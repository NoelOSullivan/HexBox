import { Injectable } from '@angular/core';
import { State, Action, StateContext } from "@ngxs/store";

import { LanguageModel, AppStateModel, IntroState } from './general.model';
import { ChangeLanguage, ChangeMouseUpDetected, ChangeIntroState, ChangeContentHeight, ChangeContentWidth, BackButtonClick, ChangeSunGameState, ChangeEggState, AddEggDomRect, RemoveAllTargetRects, TransmitEggInfo } from './general.actions';
import { append, patch } from '@ngxs/store/operators';
import { DomRect } from 'app/shared/interfaces/general';
// import { IntroState } from 'app/shared/interfaces/general';

@State<LanguageModel>({
    name: 'language',
    defaults: {
        // language: {
        language: "Fr",
        // },
    }
})

@Injectable()
export class Language {
    constructor() { }
    @Action(ChangeLanguage) changeLanguage(ctx: StateContext<LanguageModel>, action: ChangeLanguage) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            language: action.Language
        })
    }
}

//------------------------------



//------------------------------

@State<AppStateModel>({
    name: 'appState',
    defaults: {
        // appState: {
        onIntro: true,
        introState: IntroState.BLOCKALL,
        mouseUpDetected: false,
        contentHeight: 0,
        contentWidth: 0,   
        backButtonClick: false,
        sunGameOn: false,
        eggActive: false,
        sunGameTargets: [],
        eggInfo: {targetHit:0, percentLeft:0, percentTop:0}
        // },
    }
})

@Injectable()
export class AppState {
    constructor() { }
    // @Action(ChangeAppState) changeAppState(ctx: StateContext<AppStateModel>, action: ChangeAppState) {
    //     console.log("ChangeAppState", action)
    //     const state = ctx.getState();
    //     ctx.setState({
    //         ...state,
    //         appState: action.AppState
    //     })
    // }

    @Action(ChangeMouseUpDetected) changeMouseUpDetected(ctx: StateContext<AppStateModel>) {
        const state = ctx.getState();
        // const newAppState: AppStateModel = { appState: { onIntro: state.appState.onIntro, introState: state.appState.introState, mouseUpDetected: !state.appState.mouseUpDetected } };
        // ctx.setState(newAppState);
        ctx.setState({
            ...state,
            mouseUpDetected: !state.mouseUpDetected
        })
    }

    @Action(BackButtonClick) backButtonClick(ctx: StateContext<AppStateModel>) {
        const state = ctx.getState();
        // const newAppState: AppStateModel = { appState: { onIntro: state.appState.onIntro, introState: state.appState.introState, mouseUpDetected: !state.appState.mouseUpDetected } };
        // ctx.setState(newAppState);
        ctx.setState({
            ...state,
            backButtonClick: !state.backButtonClick
        })
    }

    // @Action(ChangeOnIntro) changeOnIntro(ctx: StateContext<AppStateModel>, action: ChangeOnIntro) {
    //     const state = ctx.getState();
    //     // const newAppState: AppStateModel = { appState: { onIntro: action.onIntro, introState: state.appState.introState, mouseUpDetected: state.appState.mouseUpDetected } };
    //     // ctx.setState(newAppState);
    //     ctx.setState({
    //         ...state,
    //         onIntro: action.onIntro
    //     })
    // }

    @Action(ChangeIntroState) changeIntroState(ctx: StateContext<AppStateModel>, action: ChangeIntroState) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            introState: action.introState
        })
    }

    @Action(ChangeSunGameState) changeSunGameState(ctx: StateContext<AppStateModel>, action: ChangeSunGameState) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            sunGameOn: action.sunGameOn
        })
    }

    @Action(ChangeEggState) changeEggState(ctx: StateContext<AppStateModel>, action: ChangeEggState) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            eggActive: action.eggActive
        })
    }

    @Action(ChangeContentHeight) changeContentHeight(ctx: StateContext<AppStateModel>, action: ChangeContentHeight) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            contentHeight: action.contentHeight
        })
    }

    @Action(ChangeContentWidth) changeContentWidth(ctx: StateContext<AppStateModel>, action: ChangeContentWidth) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            contentWidth: action.contentWidth
        })
    }

    @Action(AddEggDomRect) addEggDomRect(ctx: StateContext<AppStateModel>, action: AddEggDomRect) {
        const state = ctx.getState();
        let targets = state.sunGameTargets;
        targets = [...targets, action.eggDomRect]
        ctx.setState({
            ...state,
            sunGameTargets: targets
        })
    }

    @Action(RemoveAllTargetRects) removeAllTargetRects(ctx: StateContext<AppStateModel>, action: RemoveAllTargetRects) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            sunGameTargets: []
        })
    }

    @Action(TransmitEggInfo) transmitEggInfo(ctx: StateContext<AppStateModel>, action: TransmitEggInfo) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            eggInfo: action.eggInfo
        })
    }

}
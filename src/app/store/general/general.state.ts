import { Injectable } from '@angular/core';
import { State, Action, StateContext } from "@ngxs/store";

import { LanguageModel, AppStateModel, IntroState } from './general.model';
import { ChangeLanguage, ChangeMouseUpDetected, ChangeIntroState } from './general.actions';
import { patch } from '@ngxs/store/operators';
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
        mouseUpDetected: false
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

}
import { Injectable } from '@angular/core';
import { State, Action, StateContext } from "@ngxs/store";

import { LanguageModel, AppStateModel } from './general.model';
import { ChangeLanguage, ChangeAppState } from './general.actions';

@State<LanguageModel>({
    name: 'language',
    defaults: {
        language: {
            language: "Fr",
        },
    }
})

@Injectable()
export class Language{
    constructor(){}
    @Action(ChangeLanguage) changeLanguage(ctx: StateContext<LanguageModel>, action:ChangeLanguage){
        const state = ctx.getState();
        ctx.setState({
            ...state,
            language: action.Language
        })
    }
}

//------------------------------

@State<AppStateModel>({
    name: 'appState',
    defaults: {
        appState: {
            onIntro: true,
            mouseUpDetected: false
        },
    }
})

@Injectable()
export class AppState{
    constructor(){}
    @Action(ChangeAppState) changeAppState(ctx: StateContext<AppStateModel>, action:ChangeAppState){
        console.log("ChangeAppState", action)
        const state = ctx.getState();
        ctx.setState({
            ...state,
            appState: action.AppState
        })
    }
}
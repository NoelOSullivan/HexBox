import { Injectable } from '@angular/core';
import { State, Action, StateContext } from "@ngxs/store";

import { LanguageModel } from './general.model';
import { ChangeLanguage } from './general.actions';

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
    @Action(ChangeLanguage) changeRotation(ctx: StateContext<LanguageModel>, action:ChangeLanguage){
        const state = ctx.getState();
        ctx.setState({
            ...state,
            language: action.Language
        })
    }
}
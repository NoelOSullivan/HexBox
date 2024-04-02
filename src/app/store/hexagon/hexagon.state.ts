import { Injectable } from '@angular/core';
import { State, Action, StateContext } from "@ngxs/store";

import { ActivePanelNumberModel, RotationToAddModel } from './hexagon.model';
import { ChangePanelNumber, ChangeRotation } from './hexagon.actions';

@State<RotationToAddModel>({
    name: 'rotationToAdd',
    defaults: {
        rotationToAdd: {degrees:0}
    }
})

@Injectable()
export class RotationToAdd{
    constructor(){}
    @Action(ChangeRotation) changeRotation(ctx: StateContext<RotationToAddModel>, action:ChangeRotation){
        const state = ctx.getState();
        ctx.setState({
            ...state,
            rotationToAdd: action.RotationToAdd
        })
    }
}

@State<ActivePanelNumberModel>({
    name: 'activePanelNumber',
    defaults: {
        activePanelNumber: {apn:1}
    }
})

@Injectable()
export class ActivePanelNumber{
    constructor(){}
    @Action(ChangePanelNumber) changePanelNumber(ctx: StateContext<ActivePanelNumberModel>, action:ChangePanelNumber){
        const state = ctx.getState();
        ctx.setState({
            ...state,
            activePanelNumber: action.ActivePanelNumber
        })
    }
}
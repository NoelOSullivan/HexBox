import { Injectable } from '@angular/core';
import { State, Action, StateContext } from "@ngxs/store";

import { ActivePanelNumberModel, HexBoxModel, RotationToAddModel } from './hexagon.model';
import { ChangeHexBox, ChangePanelNumber, ChangeRotation } from './hexagon.actions';

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

@State<HexBoxModel>({
    name: 'hexbox',
    defaults: {
        hexbox: {topOpen: false, bottomOpen: false}
    }
})

@Injectable()
export class HexBox{
    constructor(){}
    @Action(ChangeHexBox) changeHexBox(ctx: StateContext<HexBoxModel>, action:ChangeHexBox){
        const state = ctx.getState();
        ctx.setState({
            ...state,
            hexbox: action.HexBox
        })
    }
}
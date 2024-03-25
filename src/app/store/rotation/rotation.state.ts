import { Injectable } from '@angular/core';
import { State, Action, StateContext } from "@ngxs/store";
import { RotationStateModel } from './rotation.model';

import { ChangeRotation } from './rotation.action';

@State<RotationStateModel>({
    name: 'rotation',
    defaults: {
        rotation: {degrees:0}
    }
})

@Injectable()
export class RotationState{
    constructor(){}
    @Action(ChangeRotation) changeRotation(ctx: StateContext<RotationStateModel>, action:ChangeRotation){
        const state = ctx.getState();
        ctx.setState({
            ...state,
            rotation: action.rotation
        })
    }
}
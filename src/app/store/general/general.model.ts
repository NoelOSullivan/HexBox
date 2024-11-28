// import { Language } from "../../shared/interfaces/general";

import { DomRect, EggInfo } from "app/shared/interfaces/general";

export class LanguageModel {
    public language!: string;
}

export enum IntroState {
    BLOCKALL = "blockAll",
    ALLOWCUT = "allowCut",
    ONFINALANIM = "onFinalAnim",
    DONE = "done",
}

export interface AppStateModel {
    // public appState!: AppState;
    onIntro: boolean;
    introState: IntroState;
    mouseUpDetected: boolean;
    contentHeight: number;
    contentWidth: number;
    backButtonClick: boolean;
    sunGameOn: boolean;
    eggActive: boolean;
    sunGameTargets: Array<DomRect>;
    eggInfo: EggInfo;
}


// import { Language } from "../../shared/interfaces/general";

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
}


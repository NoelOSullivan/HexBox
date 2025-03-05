// import { Language } from "../../shared/interfaces/general";

import { DomSanitizer } from "@angular/platform-browser";
import { IntroState, SunGameState } from "./general.model";
import { DomRect, EggInfo } from "app/shared/interfaces/general";

export class ChangeLanguage {
    static readonly type= '[Change language] ChangeLanguage';
    constructor(public Language: string){}
}

// export class ChangeAppState {
//     static readonly type= '[Change app state] ChangeAppState';
//     constructor(public AppState: AppState){}
// }

// export class ChangeOnIntro {
//     static readonly type= '[Change on intro] ChangeOnIntro';
//     constructor(public onIntro: boolean){}
// }

export class ChangeIntroState {
    static readonly type = '[Change intro state] ChangeIntroState';
    constructor(public introState: IntroState){}
}

export class ChangeMouseUpDetected {
    static readonly type= '[Mouse Up Detected] ChangeMouseUpDetected';
    constructor(){}
}

export class ChangeContentHeight {
    static readonly type= '[Change Content Height] ChangeContentHeight';
    constructor(public contentHeight: number){}
}

export class ChangeContentWidth {
    static readonly type= '[Change Content Width] ChangeContentWidth';
    constructor(public contentWidth: number){}
}

export class BackButtonClick {
    static readonly type= '[BackButtonClick] BackButtonClick';
    constructor(){}
}

export class ChangeSunGameState {
    static readonly type= '[ChangeSunGameState] ChangeSunGameState';
    constructor(public sunGameState: SunGameState){}
}

export class ChangeEggState {
    static readonly type= '[ChangeEggState] ChangeEggState';
    constructor(public eggActive: boolean){}
}

export class AddEggDomRect {
    static readonly type= '[AddEggDomRect] AddEggDomRect';
    constructor(public eggDomRect: DomRect){}
}

export class RemoveAllTargetRects {
    static readonly type= '[RemoveAllTargetRects] RemoveAllTargetRects';
    constructor(){}
}

export class TransmitEggInfo {
    static readonly type= '[TransmitEggInfo] TransmitEggInfo';
    constructor(public eggInfo: EggInfo){}
}


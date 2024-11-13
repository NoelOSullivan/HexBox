// import { Language } from "../../shared/interfaces/general";

import { IntroState } from "./general.model";

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
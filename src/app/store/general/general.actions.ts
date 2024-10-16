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
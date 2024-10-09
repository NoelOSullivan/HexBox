import { AppState, Language } from "../../shared/interfaces/general";

export class ChangeLanguage {
    static readonly type= '[Change language] ChangeLanguage';
    constructor(public Language: string){}
}

// export class ChangeAppState {
//     static readonly type= '[Change app state] ChangeAppState';
//     constructor(public AppState: AppState){}
// }

export class ChangeOnIntro {
    static readonly type= '[Change on intro] ChangeOnIntro';
    constructor(public onIntro: boolean){}
}

export class ChangeMouseUpDetected {
    static readonly type= '[Mouse Up Detected] ChangeMouseUpDetected';
    constructor(){}
}
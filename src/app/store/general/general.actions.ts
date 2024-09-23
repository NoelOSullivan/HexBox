import { AppState, Language } from "../../shared/interfaces/general";

export class ChangeLanguage {
    static readonly type= '[Change language] ChangeLanguage';
    constructor(public Language: Language){}
}

export class ChangeAppState {
    static readonly type= '[Change app state] ChangeAppState';
    constructor(public AppState: AppState){}
}
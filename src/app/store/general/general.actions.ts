import { Language } from "../../shared/interfaces/general";

export class ChangeLanguage {
    static readonly type= '[Change language] ChangeLanguage';
    constructor(public Language: Language){}
}
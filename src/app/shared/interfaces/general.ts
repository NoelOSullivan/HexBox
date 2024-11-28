export interface Language {
    language: string;
}

export interface DomRect {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
    x: number;
    y: number;
}

export interface EggInfo {
    targetHit: number;
    percentLeft: number;
    percentTop: number;
}

export interface HeadInfo {
  imageSrc: string;
  name: string;
  result: number;
}

// export enum IntroState {
//     "blockAll",
//     "allowCut",
//     "onFinalAnim",
//     "done"
// }

// export interface AppState {
//     onIntro: boolean;
//     introState: IntroState;
//     mouseUpDetected: boolean;
// }
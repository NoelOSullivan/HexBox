export interface PageCounters {
    counters: [number, number, number, number, number, number];
    totals: [number, number, number, number, number, number];
}

export interface Direction {
    direction: string;
}

export interface DirectAccess {
    hexNum: number | undefined;
    nPage: number | undefined;
}
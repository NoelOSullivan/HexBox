import { Injectable, signal, computed } from '@angular/core';

export type AppSection = 'ENIGMA' | 'CONTENT';

export interface AppState {
    section: AppSection | null;
}

const initialState: AppState = {
    section: 'ENIGMA'
};

@Injectable({
    providedIn: 'root'
})
export class StateService {

    private state = signal<AppState>(initialState);

    readonly currentSection = computed(() => this.state().section);

    setSection(val: AppSection) {
        this.state.update(current => ({ ...current, section: val }));
        console.log("Section changed to:", val);
    }
}
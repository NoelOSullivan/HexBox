import { Component, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Select, Store } from '@ngxs/store';
import { HeadshotComponent } from './headshot/headshot.component';
import { PlayButtonComponent } from 'app/shared/components/play-button/play-button.component';
import { ChangeSunGameState, RemoveAllTargetRects, TransmitEggInfo } from 'app/store/general/general.actions';
import { AppState } from 'app/store/general/general.state';
import { Observable } from 'rxjs';
import { AppStateModel, SunGameState } from 'app/store/general/general.model';
import { EggInfo } from 'app/shared/interfaces/general';
import { ChronoComponent } from 'app/shared/components/chrono/chrono.component';
import { ResultsComponent } from './results/results.component';
import { DataService } from 'app/shared/services/data.service';
import { HeadInfo } from 'app/shared/interfaces/general';

@Component({
  selector: 'app-thesun',
  standalone: true,
  imports: [NgIf, HeadshotComponent, PlayButtonComponent, ChronoComponent, ResultsComponent],
  providers: [DataService],
  templateUrl: './thesun.component.html',
  styleUrl: './thesun.component.scss'
})

export class ThesunComponent implements OnInit {

  @Select(AppState) appState$!: Observable<AppStateModel>;

  @Input() language!: string;
  @Input() activePageNum!: number;
  @Input() myPageNum!: number;
  @Input() myContainerIsActive!: boolean;

  constructor(private store: Store, private dataService: DataService) { }

  // If true, results are mocked and game ends after imparted time
  testGame: boolean = false;
  testGameTime: number = 5;
  gameTime: number = 60; 

  playing: boolean = false;
  eggInfo!: EggInfo;

  headInfos: Array<HeadInfo> = [];
  // Use finalHeadInfos to send infos to results component only at the end. 
  finalHeadInfos!: Array<HeadInfo>;

  headList: Array<number> = [];
  totalHeads!: number;
  activeHeadSrc: Array<string> = ["", "", "", "", "", ""];
  headUp: Array<boolean> = [true, true, true, true, true, true];

  timeInSeconds!: number;
  counterInterval: any;
  chrono!: string;
  sunGameState!: SunGameState;

  ngOnInit() {
    // Get data for candidates
    this.dataService.getData("sunGame.json").subscribe((headJSON: any) => {
      this.headInfos = headJSON.france.candidates;
      this.initHeadInfo();
      this.headList = this.initHeadList();
    });

    // Listen for an eggInfo change
    // If hit set off head switch
    this.appState$.subscribe(appState => {
      if (this.eggInfo !== appState.eggInfo) {
        this.eggInfo = appState.eggInfo;
        if (this.eggInfo.targetHit !== 0) {
          this.switchHeads(this.eggInfo.targetHit, true);
        }
      }

      if (this.sunGameState !== appState.sunGameState) {
        this.sunGameState = appState.sunGameState;
      }

    })
  }

  ngOnChanges(changes: any) {
    // If page is changed stop the game
    if (changes.activePageNum) {
      if (changes.activePageNum.currentValue !== this.myPageNum) {
        this.managePlay(false);
      }
    }

    // If container/panel is changed via hexagon click stop the game
    if (changes.myContainerIsActive) {
      if (!this.myContainerIsActive) {
        this.managePlay(false);
      }
    }
  }

  initHeadInfo(): void {
    this.totalHeads = this.headInfos.length;
    for (let i = 0; i < this.totalHeads; i++) {
      if (this.testGame) {
        // Create random results for quick testing
        let r = Math.floor(Math.random() * 50) - 25;
        this.headInfos[i].result = r;
      } else {
        // Initialise results
        this.headInfos[i].result = 0;
      }
    }
  }

  managePlay(playing: boolean): void {
    this.playing = playing;
    if (this.playing === false) {
      this.store.dispatch(new RemoveAllTargetRects());
      clearInterval(this.counterInterval);
      // this.gameOver = false;
      this.store.dispatch(new ChangeSunGameState(SunGameState.GAMEOFF));
      this.initHeadInfo();
    } else {
      // When game starts
      this.store.dispatch(new ChangeSunGameState(SunGameState.GAMEON));
      this.applyHead(1);
      this.applyHead(2);
      this.applyHead(3);
      this.applyHead(4);
      this.applyHead(5);
      this.applyHead(6);
      if (this.testGame) {
        this.initChrono(this.testGameTime);
      } else {
        this.initChrono(this.gameTime);
      }
    }
  }

  initHeadList(): Array<number> {
    let unmixedList = [];
    // create an ordered array of head numbers 1 to total
    // To do : move to a general service for array parsing etc
    for (let i = 1; i <= this.totalHeads; i++) {
      unmixedList.push(i);
    }
    return unmixedList;
  }

  applyHead(headNumber: number): void {
    let random = Math.floor(Math.random() * this.totalHeads);
    let candidateNumber = this.headList[random];
    let src = this.headInfos[candidateNumber - 1].imageSrc;

    // Avoid having more than one of the same head
    while (this.activeHeadSrc.indexOf(src) !== -1) {
      random = Math.floor(Math.random() * this.totalHeads);
      candidateNumber = this.headList[random];
      src = this.headInfos[candidateNumber - 1].imageSrc;
    }
    // Apply to array sent to headshot instances
    this.activeHeadSrc[headNumber - 1] = src;
  }

  switchHeads(head: number, targetWasHit: boolean): void {
    if (this.sunGameState === SunGameState.GAMEON) {
      // Head goes down
      this.headUp[head - 1] = false;
      // Manage scoring
      // Find corresponding object for a head
      const targetIndex = this.headInfos.findIndex(f => f.imageSrc === this.activeHeadSrc[head - 1]);

      // Update the result for the specific head
      if (targetWasHit) {
        if (head < 2) {
          this.headInfos[targetIndex].result = -3;
        } else {
          if (head < 4) {
            this.headInfos[targetIndex].result = -2;
          } else {
            this.headInfos[targetIndex].result = -1;
          }
        }
      } else {
        if (head < 2) {
          this.headInfos[targetIndex].result += 1;
        } else {
          if (head < 4) {
            this.headInfos[targetIndex].result += 2;
          } else {
            this.headInfos[targetIndex].result += 3;
          }
        }
      }
      setTimeout(() => {
        this.applyHead(head);
        // Hide the egg before the head pops back up
        this.store.dispatch(new TransmitEggInfo({ targetHit: 0, percentLeft: 0, percentTop: 0 }));
        // Head will pop up
        this.headUp[head - 1] = true;
      }, 500); // Time value corresponds to transition speed of headin headshot component. Allows head the time to disappear.
    }
  }

  initChrono(seconds: number): void {
    this.timeInSeconds = seconds;
    this.updateChrono();
    this.counterInterval = setInterval(() => {
      this.updateChrono();
    }, 1000);
  }

  updateChrono(): void {
    // To do : time treatment service perhaps
    let seconds = this.timeInSeconds;
    if (seconds > 0) {
      this.timeInSeconds--;
    }
    else {
      this.store.dispatch(new ChangeSunGameState(SunGameState.GAMEOVER));
      // this.gameOver = true;
      this.finalHeadInfos = this.headInfos.sort((a, b) => b.result - a.result);
      clearInterval(this.counterInterval);
    }
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;
    this.chrono = ((minutes < 10) ? "0" : "") + minutes + ":" + ((seconds < 10) ? "0" : "") + seconds;
  }
}
import { Component, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Select, Store } from '@ngxs/store';
import { HeadshotComponent } from './headshot/headshot.component';
import { PlayButtonComponent } from 'app/shared/components/play-button/play-button.component';
import { ChangeSunGameState, RemoveAllTargetRects, TransmitEggInfo } from 'app/store/general/general.actions';
import { AppState } from 'app/store/general/general.state';
import { Observable } from 'rxjs';
import { AppStateModel } from 'app/store/general/general.model';
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

  playing: boolean = false;
  firstShot: boolean = false;
  eggInfo!: EggInfo;
  // headFileNames!: Array<string>;
  // results!: Array<number>;
  // newResults!: Array<object>;
  finalHeadInfos!: Array<HeadInfo>;
  // filePath!: string;

  hoop1Src!: string;
  hoop2Src!: string;
  hoop3Src!: string;
  hoop4Src!: string;
  hoop5Src!: string;
  hoop6Src!: string;

  headInfos: Array<HeadInfo> = [];

  headList: Array<number> = [];
  totalHeads!: number;
  activeSrc: Array<string> = ["", "", "", "", "", ""];
  headUp: Array<boolean> = [true, true, true, true, true, true];
  headCounter: number = 0;

  timeInSeconds!: number;
  counterInterval: any;
  chrono!: string;
  gameOver: boolean = false;
  headArrayFromJSON!: Array<any>;
  headObject!: HeadInfo;

  ngOnInit() {

    // Get data for candidates
    this.dataService.getData("sunGame.json").subscribe((headJSON: any) => {
      this.headInfos = headJSON.france.candidates;
      // console.log("HEAD DATA", headJSON);

      // this.items = carouselData.carousel.items;


      this.initHeadInfo();
      this.headList = this.initHeadList();
      // console.log("this.headList", this.headList);
    });



    // this.filePath = "assets/images/thesun/";
    // this.headFileNames = [
    //   "hidalgo.png",
    //   "roussel.png",
    //   "dupont-aignan.png",
    //   "arthaud.png",
    //   "lepen.png",
    //   "macron.png",
    //   "melenchon.png",
    //   "pecresse.png",
    //   "poutou.png",
    //   "zemmour.png",
    //   "lassalle.png",
    //   "jadot.png"
    // ]
    // this.results = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];



    // Listen for an eggInfo change
    // if hit set off head switch
    this.appState$.subscribe(appState => {
      if (this.eggInfo !== appState.eggInfo) {
        this.eggInfo = appState.eggInfo;
        if (this.eggInfo.targetHit !== 0) {
          this.switchHeads(this.eggInfo.targetHit, true);
        }
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

    // If container is changed via hexagon click stop the game
    if (changes.myContainerIsActive) {
      if (!this.myContainerIsActive) {
        this.managePlay(false);
      }
    }
  }

  initHeadInfo(): void {

    // this.headInfos = this.headJSON["france"];

    
    console.log("this.headInfos", this.headInfos);



    this.totalHeads = this.headInfos.length;

    for (let i = 0; i < this.totalHeads; i++) {
      console.log(i, this.headInfos[i]);
      let r = Math.floor(Math.random() * 50) - 25;
      console.log("r", r);
      this.headInfos[i].result = r;

    }

    // for (let i = 1; i <= this.totalHeads; i++) {
    //   let headInfos: HeadInfo = {
    //     imageSrc:  this.headArrayFromJSON[i].src,
    //     name:  this.headArrayFromJSON[i].name,
    //     result: 0
    //   }
    // }
  }

  managePlay(playing: boolean): void {
    this.playing = playing;
    this.store.dispatch(new ChangeSunGameState(this.playing));
    if (this.playing === false) {
      this.store.dispatch(new RemoveAllTargetRects());
      clearInterval(this.counterInterval);
      this.gameOver = false;
      this.initHeadInfo();
    } else {
      // When game starts
      this.applyHead(1);
      this.applyHead(2);
      this.applyHead(3);
      this.applyHead(4);
      this.applyHead(5);
      this.applyHead(6);
      this.initTimer(1);
    }
  }

  initHeadList(): Array<number> {
    let unmixedList = [];
    // create an ordered array of head numbers 1 to total
    for (let i = 1; i <= this.totalHeads; i++) {
      unmixedList.push(i);
    }
    return unmixedList;
  }

  applyHead(headNumber: number): void {
    let random = Math.floor(Math.random() * this.totalHeads);
    let candidateNumber = this.headList[random];
    // let src = this.filePath + this.headFileNames[candidateNumber - 1];
    let src = this.headInfos[candidateNumber - 1].imageSrc;

    while (this.activeSrc.indexOf(src) !== -1) {
      random = Math.floor(Math.random() * this.totalHeads);
      candidateNumber = this.headList[random];
      // src = this.filePath + this.headFileNames[candidateNumber - 1];
      src = this.headInfos[candidateNumber - 1].imageSrc;
    }
    this.activeSrc[headNumber - 1] = src;
  }

  switchHeads(head: number, targetWasHit: boolean): void {
    if (!this.gameOver) {
      this.headUp[head - 1] = false;
      // Manage scoring;
      let pathAsArray = this.activeSrc[head - 1].split("/")
      // let headName = pathAsArray[pathAsArray.length - 1];

      // let headObject = this.headInfos.filter(obj => {
      //   return obj.imageSrc === this.activeSrc[head - 1]
      // })

      // headObject.

      // const headInfoCopy = [...this.headInfos];
      const targetIndex = this.headInfos.findIndex(f=>f.imageSrc===this.activeSrc[head - 1]);
      // headInfoCopy[targetIndex].result = -3;

//       const summerFruitsCopy = [...summerFruits];

// //find index of item to be replaced
// const targetIndex = summerFruits.findIndex(f=>f.id===3); 

// //replace the object with a new one.
// summerFruitsCopy[targetIndex] = fruit;

      // console.log("HO", headObject);
      // let resultPos = this.headFileNames.indexOf(headName);

      if (targetWasHit) {
        console.log("this.headObject", this.headObject);
        if (head < 2) {
          // this.headObject.result -= -3;
          this.headInfos[targetIndex].result = -3;
          // this.headInfos[]
          // this.results[resultPos] -= 3;
        } else {
          if (head < 4) {
            this.headInfos[targetIndex].result = -2;
            // this.results[resultPos] -= 2;
          } else {
            this.headInfos[targetIndex].result = -1;
            // this.results[resultPos] -= 1;
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
        // this.results[resultPos] += 1;
      }
      // console.log("this.headInfos", this.headInfos);
      setTimeout(() => {
        this.applyHead(head);
        this.headUp[head - 1] = true;
        this.store.dispatch(new TransmitEggInfo({ targetHit: 0, percentLeft: 0, percentTop: 0 }));
      }, 500);
    }
  }

  initTimer(seconds: number): void {
    this.timeInSeconds = seconds;
    this.updateTimer();
    this.counterInterval = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  updateTimer(): void {
    let seconds = this.timeInSeconds;
    if (seconds > 0) {
      this.timeInSeconds--;
    }
    else {
      this.gameOver = true;
      //this.finalResults = this.results;
      // this.finalResults = [25,20,15,10,5,0,-5,-10,-15,-20,-25,-30];
      //this.finalResults = [-25,-20,-15,-10,-5,0,-5,-10,-15,-20,-25,-50];

      this.finalHeadInfos = this.headInfos.sort((a, b) => b.result-a.result);
      clearInterval(this.counterInterval);
    }
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;
    this.chrono = ((minutes < 10) ? "0" : "") + minutes + ":" + ((seconds < 10) ? "0" : "") + seconds;
  }
}
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { Store } from '@ngxs/store';
import { SwipeIconComponent } from '../swipe-icon/swipe-icon.component';
import { Direction } from 'app/shared/interfaces/panel';
import { TurnPage } from 'app/store/panel/panel.action';

@Component({
  selector: 'app-next-page-button',
  standalone: true,
  imports: [NgIf, SwipeIconComponent],
  templateUrl: './next-page-button.component.html',
  styleUrl: './next-page-button.component.scss'
})
export class NextPageButtonComponent {

  @Input() activePageNum!: number;
  @Input() isLastPage!: boolean;
  @Input() leftTextFrEn!: string;
  @Input() rightTextFrEn!: string;
  @Input() language!: string;

  rightText: string = "";
  leftText: string = "";
  twoPossiblesRight!: Array<string>;
  twoPossiblesLeft!: Array<string>;
  blockLeft: boolean = false;
  blockRight: boolean = false;

  constructor(private store: Store) {}

  ngOnChanges(changes: any): void {
    if (changes.language) {
      if(this.twoPossiblesRight) {
        this.rightText = this.language === "Fr" ? this.twoPossiblesRight[0] : this.twoPossiblesRight[1];
      }
      if(this.twoPossiblesLeft) {
        this.leftText = this.language === "Fr" ? this.twoPossiblesLeft[0] : this.twoPossiblesLeft[1];
      }
    }

    if (changes.rightTextFrEn) {
      this.twoPossiblesRight = changes.rightTextFrEn.currentValue.split("#");
      if(this.language) {
        this.rightText = this.language === "Fr" ? this.twoPossiblesRight[0] : this.twoPossiblesRight[1];
      }
    }

    if (changes.leftTextFrEn) {
      this.twoPossiblesLeft = changes.leftTextFrEn.currentValue.split("#");
      if(this.language) {
        this.leftText = this.language === "Fr" ? this.twoPossiblesLeft[0] : this.twoPossiblesLeft[1];
      }
    }

    let that = this;
    if (changes.activePageNum) {
      if(changes.activePageNum.currentValue<=0) {
        that.blockLeft = true;
      } else {
        that.blockLeft = false;
      }
    }

    if (changes.isLastPage) {
      this.blockRight = changes.isLastPage;
    }
  }

  turnPageToRight():void {
    const directionObj: Direction = { direction: "left" };
    this.store.dispatch(new TurnPage(directionObj));
  }

  turnPageToLeft():void {
    const directionObj: Direction = { direction: "right" };
    this.store.dispatch(new TurnPage(directionObj));
  }
  

}

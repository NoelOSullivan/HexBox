import { Component, Input} from '@angular/core';
import { Store } from '@ngxs/store';
import { AccessPanelDirect } from '../../../store/panel/panel.action';
import { DirectAccess } from '../../interfaces/panel';
import { LinkIconComponent } from '../link-icon/link-icon.component';

@Component({
  selector: 'app-direct-access',
  standalone: true,
  imports: [LinkIconComponent],
  providers: [],
  templateUrl: './direct-access.component.html',
  styleUrl: './direct-access.component.scss'
})
export class DirectAccessComponent {

  @Input() linkText: string | undefined;
  @Input() hexNum!: number;
  @Input() nPage!: number;

  constructor(private store: Store) { }

  clickDirectAccess() {
    const directAccess: DirectAccess = {hexNum: this.hexNum, nPage: this.nPage};
    this.store.dispatch(new AccessPanelDirect(directAccess));
  }

}
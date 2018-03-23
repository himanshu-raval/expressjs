import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { PlayerRoutingModule } from './player-routing.module';
import { PlayerComponent } from './player.component';
import { PlayerService } from './player.service';
import { PageHeaderModule } from '../../Default/Angular/shared/modules/page-header/page-header.module';
import { PagerService } from '../../Default/Angular/shared/components/pager/pager.service';

@NgModule({
  imports: [
    CommonModule,
    PlayerRoutingModule,
    PageHeaderModule,
    NgbPaginationModule.forRoot()
  ],
  declarations: [PlayerComponent],
  providers: [
        PagerService,
        PlayerService
  ],
})
export class PlayerModule { }

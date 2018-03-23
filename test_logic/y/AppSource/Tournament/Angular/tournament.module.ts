import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule }   from '@angular/forms';

import { TournamentRoutingModule } from './tournament-routing.module';
import { TournamentComponent } from './tournament.component';
import { TournamentService } from './tournament.service';
import { PageHeaderModule } from '../../Default/Angular/shared/modules/page-header/page-header.module';
import { PagerService } from '../../Default/Angular/shared/components/pager/pager.service';

@NgModule({
  imports: [
    CommonModule,
    TournamentRoutingModule,
    PageHeaderModule,
    FormsModule,
    NgbPaginationModule.forRoot()
  ],
  declarations: [TournamentComponent],
  providers: [
        PagerService,
        TournamentService
  ],
})
export class TournamentModule { }

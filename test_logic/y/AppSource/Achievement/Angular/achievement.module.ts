import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule }   from '@angular/forms';

import { AchievementRoutingModule } from './achievement-routing.module';
import { AchievementComponent } from './achievement.component';
import { AchievementService } from './achievement.service';
import { PageHeaderModule } from '../../Default/Angular/shared/modules/page-header/page-header.module';
import { PagerService } from '../../Default/Angular/shared/components/pager/pager.service';

@NgModule({
  imports: [
    CommonModule,
    AchievementRoutingModule,
    PageHeaderModule,
    FormsModule,
    NgbPaginationModule.forRoot()
  ],
  declarations: [AchievementComponent],
  providers: [
        PagerService,
        AchievementService
  ],
})
export class AchievementModule { }

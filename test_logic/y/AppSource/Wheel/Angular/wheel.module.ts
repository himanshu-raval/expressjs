import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule }   from '@angular/forms';

import { WheelRoutingModule } from './wheel-routing.module';
import { WheelComponent } from './wheel.component';
import { WheelService } from './wheel.service';
import { PageHeaderModule } from '../../Default/Angular/shared/modules/page-header/page-header.module';
import { PagerService } from '../../Default/Angular/shared/components/pager/pager.service';

@NgModule({
  imports: [
    CommonModule,
    WheelRoutingModule,
    PageHeaderModule,
    NgbPaginationModule.forRoot(),
    FormsModule
  ],
  declarations: [WheelComponent],
  providers: [
        PagerService,
        WheelService
  ],
})
export class WheelModule { }

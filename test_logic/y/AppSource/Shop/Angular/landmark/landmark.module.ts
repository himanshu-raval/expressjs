import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule }   from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';

import { LandmarkRoutingModule } from './landmark-routing.module';
import { LandmarkComponent } from './landmark.component';
import { LandmarkService } from './landmark.service';
import { PageHeaderModule } from '../../../Default/Angular/shared/modules/page-header/page-header.module';
import { PagerService } from '../../../Default/Angular/shared/components/pager/pager.service';

@NgModule({
  imports: [
    CommonModule,
    LandmarkRoutingModule,
    PageHeaderModule,
    FormsModule,
    FileUploadModule,  
    NgbPaginationModule.forRoot()
  ],
  declarations: [LandmarkComponent],
  providers: [
        PagerService,
        LandmarkService
  ],
})
export class LandmarkModule { }

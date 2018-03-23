import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule }   from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';

import { GemsRoutingModule } from './gems-routing.module';
import { GemsComponent } from './gems.component';
import { GemsService } from './gems.service';
import { PageHeaderModule } from '../../../Default/Angular/shared/modules/page-header/page-header.module';
import { PagerService } from '../../../Default/Angular/shared/components/pager/pager.service';

@NgModule({
  imports: [
    CommonModule,
    GemsRoutingModule,
    PageHeaderModule,
    FormsModule,
    FileUploadModule,
    NgbPaginationModule.forRoot()
  ],
  declarations: [GemsComponent],
  providers: [
        PagerService,
        GemsService
  ],
})
export class GemsModule { }

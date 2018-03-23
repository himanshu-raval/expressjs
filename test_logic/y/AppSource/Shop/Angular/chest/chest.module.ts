import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule }   from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';

import { ChestRoutingModule } from './chest-routing.module';
import { ChestComponent } from './chest.component';
import { ChestService } from './chest.service';
import { PageHeaderModule } from '../../../Default/Angular/shared/modules/page-header/page-header.module';
import { PagerService } from '../../../Default/Angular/shared/components/pager/pager.service';

@NgModule({
  imports: [
    CommonModule,
    ChestRoutingModule,
    PageHeaderModule,
    FormsModule,
    FileUploadModule,  
    NgbPaginationModule.forRoot()
  ],
  declarations: [ChestComponent],
  providers: [
        PagerService,
        ChestService
  ],
})
export class ChestModule { }

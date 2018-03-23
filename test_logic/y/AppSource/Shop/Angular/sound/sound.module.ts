import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule }   from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';

import { SoundRoutingModule } from './sound-routing.module';
import { SoundComponent } from './sound.component';
import { SoundService } from './sound.service';
import { PageHeaderModule } from '../../../Default/Angular/shared/modules/page-header/page-header.module';
import { PagerService } from '../../../Default/Angular/shared/components/pager/pager.service';

@NgModule({
  imports: [
    CommonModule,
    SoundRoutingModule,
    PageHeaderModule,
    FormsModule,
    FileUploadModule,
    NgbPaginationModule.forRoot()
  ],
  declarations: [SoundComponent],
  providers: [
        PagerService,
        SoundService
  ],
})
export class SoundModule { }

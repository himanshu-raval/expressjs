import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule }   from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';

import { AvatarRoutingModule } from './avatar-routing.module';
import { AvatarComponent } from './avatar.component';
import { AvatarService } from './avatar.service';
import { PageHeaderModule } from '../../../Default/Angular/shared/modules/page-header/page-header.module';
import { PagerService } from '../../../Default/Angular/shared/components/pager/pager.service';

@NgModule({
  imports: [
    CommonModule,
    AvatarRoutingModule,
    PageHeaderModule,
    FormsModule,
    FileUploadModule,
    NgbPaginationModule.forRoot()
  ],
  declarations: [AvatarComponent],
  providers: [
        PagerService,
        AvatarService
  ],
})
export class AvatarModule { }

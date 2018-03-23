import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule }   from '@angular/forms';

import { HelpRoutingModule } from './help-routing.module';
import { HelpComponent } from './help.component';
import { HelpService } from './help.service';
import { PageHeaderModule } from '../../Default/Angular/shared/modules/page-header/page-header.module';
import { PagerService } from '../../Default/Angular/shared/components/pager/pager.service';

@NgModule({
  imports: [
    CommonModule,
    HelpRoutingModule,
    PageHeaderModule,
    NgbPaginationModule.forRoot(),
    FormsModule,
    CKEditorModule
  ],
  declarations: [HelpComponent],
  providers: [
        PagerService,
        HelpService
  ],
})
export class HelpModule { }

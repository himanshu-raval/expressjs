import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule }   from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';

import { CoinRoutingModule } from './coin-routing.module';
import { CoinComponent } from './coin.component';
import { CoinService } from './coin.service';
import { PageHeaderModule } from '../../../Default/Angular/shared/modules/page-header/page-header.module';
import { PagerService } from '../../../Default/Angular/shared/components/pager/pager.service';

@NgModule({
  imports: [
    CommonModule,
    CoinRoutingModule,
    PageHeaderModule,
    FormsModule,
    FileUploadModule,  
    NgbPaginationModule.forRoot()
  ],
  declarations: [CoinComponent],
  providers: [
        PagerService,
        CoinService
  ],
})
export class CoinModule { }

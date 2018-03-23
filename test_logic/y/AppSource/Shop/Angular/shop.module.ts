import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';

import { ShopRoutingModule } from './shop-routing.module';

import { ShopComponent } from './shop.component';

@NgModule({
    imports: [
        CommonModule,
        NgbModule.forRoot(),
        NgbButtonsModule.forRoot(),
        ShopRoutingModule,
    ],
    declarations: [ ShopComponent ]
})
export class ShopModule { }

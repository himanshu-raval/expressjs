import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WheelComponent } from './wheel.component';

const routes: Routes = [
    { path: '', component: WheelComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WheelRoutingModule { }

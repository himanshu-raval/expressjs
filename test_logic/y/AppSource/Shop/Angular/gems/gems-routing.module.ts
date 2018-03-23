import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GemsComponent } from './gems.component';

const routes: Routes = [
    { path: '', component: GemsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GemsRoutingModule { }

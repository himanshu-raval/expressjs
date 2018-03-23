import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChestComponent } from './chest.component';

const routes: Routes = [
    { path: '', component: ChestComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChestRoutingModule { }

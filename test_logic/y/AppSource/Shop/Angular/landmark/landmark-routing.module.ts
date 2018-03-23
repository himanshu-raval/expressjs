import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandmarkComponent } from './landmark.component';

const routes: Routes = [
    { path: '', component: LandmarkComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LandmarkRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SoundComponent } from './sound.component';

const routes: Routes = [
    { path: '', component: SoundComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SoundRoutingModule { }

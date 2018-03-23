import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopComponent } from './shop.component';

const routes: Routes = [
    { 
    	path: '', component: ShopComponent,
    	children: [
            { path: 'avatar', loadChildren: './avatar/avatar.module#AvatarModule' },
            { path: 'gems', loadChildren: './gems/gems.module#GemsModule' },
            { path: 'card', loadChildren: './card/card.module#CardModule' },
            { path: 'chest', loadChildren: './chest/chest.module#ChestModule' },
            { path: 'coin', loadChildren: './coin/coin.module#CoinModule' },
            { path: 'landmark', loadChildren: './landmark/landmark.module#LandmarkModule' },
            { path: 'sound', loadChildren: './sound/sound.module#SoundModule' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShopRoutingModule { }

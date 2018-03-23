import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            // { path: 'aisrts', loadChildren: '../../../AisRts/Angular/aisrts.module#AisRtsModule' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'player', loadChildren: '../../../Player/Angular/player.module#PlayerModule' },
            { path: 'shop', loadChildren: '../../../Shop/Angular/shop.module#ShopModule' },
            { path: 'help', loadChildren: '../../../Help/Angular/help.module#HelpModule' },
            { path: 'wheel', loadChildren: '../../../Wheel/Angular/wheel.module#WheelModule' },
            { path: 'achievement', loadChildren: '../../../Achievement/Angular/achievement.module#AchievementModule' },
            { path: 'tournament', loadChildren: '../../../Tournament/Angular/tournament.module#TournamentModule' },
            // { path: 'charts', loadChildren: './charts/charts.module#ChartsModule' },
            // { path: 'tables', loadChildren: './tables/tables.module#TablesModule' },
            // { path: 'forms', loadChildren: './form/form.module#FormModule' },
            // { path: 'bs-element', loadChildren: './bs-element/bs-element.module#BsElementModule' },
            // { path: 'grid', loadChildren: './grid/grid.module#GridModule' },
            // { path: 'components', loadChildren: './bs-component/bs-component.module#BsComponentModule' },
            // { path: 'blank-page', loadChildren: './blank-page/blank-page.module#BlankPageModule' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }

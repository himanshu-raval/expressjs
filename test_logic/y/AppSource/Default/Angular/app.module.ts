import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http, BrowserXhr } from '@angular/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgProgressModule, NgProgressBrowserXhr } from 'ngx-progressbar';
import { CKEditorModule } from 'ng2-ckeditor';

import { customHttpProvider } from './shared/services/custom-http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { AlertService } from './shared/components/alert/alert.service';
import { UserService } from '../../User/Angular/user.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        NgbModule.forRoot(),
        NgProgressModule,
        CKEditorModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [Http]
            }
        })
    ],
    providers: [AuthGuard, 
    AlertService,
    { provide: BrowserXhr, useClass: NgProgressBrowserXhr }, 
    customHttpProvider, 
    UserService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { AuthenticationService } from '../auth.service';

@NgModule({
	imports: [
		CommonModule,
		LoginRoutingModule,
		FormsModule
	],
	providers: [AuthenticationService],
	declarations: [LoginComponent]
})
export class LoginModule { }

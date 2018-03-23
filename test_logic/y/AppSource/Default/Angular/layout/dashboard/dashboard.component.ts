import { Component, OnInit } from '@angular/core';

import { User } from '../../../../User/Angular/user.model';
import { UserService } from '../../../../User/Angular/user.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    public alerts: Array<any> = [];
    currentUser: User;
    users: User[] = [];



    ngOnInit() {
        // this.loadAllUsers();
    }

    deleteUser(_id: string) {
        this.userService.delete(_id).subscribe(() => { this.loadAllUsers() });
    }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }
    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.alerts.push({
            id: 1,
            type: 'success',
            message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Voluptates est animi quibusdam praesentium quam, et perspiciatis,
            consectetur velit culpa molestias dignissimos
            voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`,
        }, {
            id: 2,
            type: 'warning',
            message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Voluptates est animi quibusdam praesentium quam, et perspiciatis,
            consectetur velit culpa molestias dignissimos
            voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`,
        });
    }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }
}

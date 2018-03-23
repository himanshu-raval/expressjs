import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'shop-component',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
	constructor(public router: Router) { }

    ngOnInit() {
        if (this.router.url === '/shop') {
            this.router.navigate(['/shop/avatar']);
        }
    }
}

import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../Default/Angular/shared/components/alert/alert.service';

import { HelpService } from './help.service';
import { Help } from './help.model';

@Component({
	selector: 'help-page',
	templateUrl: './help.component.html',
	styleUrls: ['./help.component.scss'],
})


export class HelpComponent implements OnInit {
    help: Help = new Help();

	constructor(
        private helpService: HelpService, 
        private alertService: AlertService) { }

    ngOnInit() {
        this.help.text = `<p>Your help text</p>`;
        this.helpService.get()
            .subscribe(data => {
                if(data.status == 'success'){
                    this.help = data.result;
                }else{
                    this.alertService.error(data.message, true);
                }
            });
    }


    updateHelp(){
        this.helpService.update(this.help)
            .subscribe(data => {
                if(data.status == 'success'){
                    this.alertService.success('Help updated successfuly', true);
                }else{
                    this.alertService.error(data.message, true);
                }
            });
    }

}

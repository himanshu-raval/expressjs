import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { AlertService } from '../../Default/Angular/shared/components/alert/alert.service';
import { WheelService } from './wheel.service';


@Component({
	selector: 'wheel-page',
	templateUrl: './wheel.component.html',
	styleUrls: ['./wheel.component.scss'],
})


export class WheelComponent implements OnInit {
    loading = false;
    editIndex:number = null;
    model: any = {};
    private allItems: any[];
    types:any[] = [
    {name:'Free', value:'free'},
    {name:'Paid', value:'paid'},
    ];
    modalRef: NgbModalRef;
    constructor(
        private wheelService: WheelService, 
        private modalService: NgbModal,
        private alertService: AlertService) { }

    open(content) {
        this.modalRef = this.modalService.open(content);
    }


    ngOnInit() {
        this.wheelService.getAll()
        .subscribe(data => {
            if(data.status == 'success'){
                this.allItems = data.result;
            }else{
                this.alertService.error(data.message, true);
            }
        });
    }

    submit(){
        if(this.editIndex == null){
            this.createSlice();
        }else{
            this.updateSlice();
        }
    }
    createSlice(){
        this.wheelService.create(this.model)
        .subscribe(data => {
            if(data.status == 'success'){
                this.allItems.push(data.result);
                this.alertService.success('New slice created successfully', true);
                this.model = {};
                this.modalRef.close();
            }else{
                this.modalRef.close();
                this.alertService.error(data.message, true);
            }
        });
    }
    editSlice(index:number, content){
        this.model = this.allItems[index];
        this.editIndex = index;
        this.modalRef = this.modalService.open(content);
        this.modalRef.result.then((result) => {
            this.editIndex = null;
        }, (reason) => {
            this.editIndex = null;
        });
    }
    updateSlice(){
        this.wheelService.update(this.model)
        .subscribe(data => {
            if(data.status == 'success'){
                this.allItems[this.editIndex]= data.result;
                this.alertService.success('Slice updated successfuly', true);
                this.model = {};
                this.modalRef.close();
            }else{
                this.alertService.error(data.message, true);
            }
        });
    }
    deleteSlice(index:any){
        this.wheelService.delete(this.allItems[index].id)
        .subscribe(data => {
            if(data.status == 'success'){
                this.allItems.splice(index,1);
                this.alertService.success('Help updated successfuly', true);
            }else{
                this.alertService.error(data.message, true);
            }
        });
    }

}

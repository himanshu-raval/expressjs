import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PagerService } from '../../Default/Angular/shared/components/pager/pager.service';
import { AlertService } from '../../Default/Angular/shared/components/alert/alert.service';

import { AchievementService } from './achievement.service';


@Component({
    selector: 'achievement-page',
    templateUrl: './achievement.component.html',
    styleUrls: ['./achievement.component.scss'],
})


export class AchievementComponent implements OnInit {
    private allItems: any[];
    pager: any = {};
    model: any = {};
    editIndex:number = null;
    pagedItems: any[];
    currentPage: number;
    pageSize:number = 20;
    modalRef: NgbModalRef;
    constructor(private achievementService: AchievementService, 
        private pagerService: PagerService,
        private modalService: NgbModal,
        private alertService: AlertService) { }

    ngOnInit() {

        // get dummy data
        this.achievementService.getAll()
            .subscribe(data => {
                if(data.status == 'success'){
                    this.allItems = data.result;
                    console.log(data.message);
                    this.setPage(1);
                }else{
                    alert(data.message);
                }
            });
    }

    updateList(){

        this.achievementService.getAll()
            .subscribe(data => {
                if(data.status == 'success'){
                    this.allItems = data.result;
                    console.log(data.message);
                    this.setPage(1);
                }else{
                    alert(data.message);
                }
            });

    }


    open(content) {
        this.modalRef = this.modalService.open(content);
    }

    submit(){
          
        if(this.editIndex == null){
            this.createAchievement();
        }else{
            this.updateAchievement();
        }
    }

    setPage(page: number) {
        this.currentPage = page;
        if (page < 1 || page > this.pager.totalPages) { return; }
        this.pager = this.pagerService.getPager(this.allItems.length, page, this.pageSize);
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

     createAchievement(){
         console.log(this.model);
        this.achievementService.create(this.model)
        .subscribe(data => {
            console.log('insert Achievement');
             
            if( data.status == 'success' ){
                console.log(data.result);
                this.allItems.push(data.result);
                this.updateList(); // Update list 
                this.alertService.success('New Achievement created successfully', true);
                this.model = {};
                this.modalRef.close();
            }else{
                this.modalRef.close();
                this.alertService.error(data.message, true);
            }
             
        });
    }
    editAchievement(index:number, content){
        index = index + ((this.currentPage -1) * this.pageSize)
        this.model = this.allItems[index];
        this.editIndex = index;
        this.modalRef = this.modalService.open(content);
        this.modalRef.result.then((result) => {
            this.editIndex = null;
        }, (reason) => {
            this.editIndex = null;
        });
    }

    updateAchievement(){
        this.achievementService.update(this.model)
        .subscribe(data => {
             console.log(data);
            if(data.status == 'success'){
                this.allItems[this.editIndex]= data.result;
                this.alertService.success('Achievement Updated Successfully', true);
                this.model = {};
                this.modalRef.close();
            }else{
                this.alertService.error(data.message, true);
            }
             
        });
    }

    deleteAchievement(index:any){
        index = index + ((this.currentPage -1) * this.pageSize)
        console.log("Delete Item No ",index)
        this.achievementService.delete(this.allItems[index].id)
        .subscribe(data => {
            if(data.status == 'success'){
                this.allItems.splice(index,1);
                this.alertService.success('Achievement Deleted Successfuly', true);
            }else{
                this.alertService.error(data.message, true);
            }
        });
    }

}


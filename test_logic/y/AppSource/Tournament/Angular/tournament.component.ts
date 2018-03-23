import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PagerService } from '../../Default/Angular/shared/components/pager/pager.service';
import { AlertService } from '../../Default/Angular/shared/components/alert/alert.service';

import { TournamentService } from './tournament.service';


@Component({
    selector: 'tournament-page',
    templateUrl: './tournament.component.html',
    styleUrls: ['./tournament.component.scss'],
})


export class TournamentComponent implements OnInit {
    private allItems: any[];
    pager: any = {};
    model: any = {};
    editIndex:number = null;
    pagedItems: any[];
    currentPage: number;
    pageSize:number = 20;
    modalRef: NgbModalRef;
    constructor(private tournamentService: TournamentService, 
        private pagerService: PagerService,
        private modalService: NgbModal,
        private alertService: AlertService) { }

    ngOnInit() {

        // get dummy data
        this.tournamentService.getAll()
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

        this.tournamentService.getAll()
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
            this.createTournament();
        }else{
            this.updateTournament();
        }
    }

    setPage(page: number) {
        this.currentPage = page;
        if (page < 1 || page > this.pager.totalPages) { return; }
        this.pager = this.pagerService.getPager(this.allItems.length, page, this.pageSize);
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

     createTournament(){
         console.log(this.model);
        this.tournamentService.create(this.model)
        .subscribe(data => {
            console.log('insert Tournament');
             
            if( data.status == 'success' ){
                console.log(data.result);
                this.allItems.push(data.result);
                this.updateList(); // Update list 
                this.alertService.success('New Tournament created successfully', true);
                this.model = {};
                this.modalRef.close();
            }else{
                this.modalRef.close();
                this.alertService.error(data.message, true);
            }
             
        });
    }
    editTournament(index:number, content){
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

    updateTournament(){
        this.tournamentService.update(this.model)
        .subscribe(data => {
             console.log(data);
            if(data.status == 'success'){
                this.allItems[this.editIndex]= data.result;
                this.alertService.success('Tournament Updated Successfully', true);
                this.model = {};
                this.modalRef.close();
            }else{
                this.alertService.error(data.message, true);
            }
             
        });
    }

    deleteTournament(index:any){
        index = index + ((this.currentPage -1) * this.pageSize)
        console.log("Delete Item No ",index)
        this.tournamentService.delete(this.allItems[index].id)
        .subscribe(data => {
            if(data.status == 'success'){
                this.allItems.splice(index,1);
                this.alertService.success('Tournament Deleted Successfuly', true);
            }else{
                this.alertService.error(data.message, true);
            }
        });
    }

}


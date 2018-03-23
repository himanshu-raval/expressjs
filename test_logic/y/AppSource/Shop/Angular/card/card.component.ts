import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';   // for image Upload
import { PagerService } from '../../../Default/Angular/shared/components/pager/pager.service';
import { CardService } from './card.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../Default/Angular/shared/components/alert/alert.service';

import { Config } from '../../../Default/Angular/shared/config/app.config';



@Component({
	selector: 'card-page',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.scss'],
})


export class CardComponent implements OnInit {
    private allItems: any[];
    pager: any = {};
    model: any = {};
    pageSize:number = 20;
    editIndex:number = null;
    pagedItems: any[];
    currentPage: number;
    modalRef: NgbModalRef;
    url = Config.apiUrl;
 


     /* image Upload */
    public uploader: FileUploader = new FileUploader({ url: Config.apiUrl+'/Shop/Card/api/upload' });
    public hasBaseDropZoneOver: boolean = false;
    public hasAnotherDropZoneOver: boolean = false;


	constructor(private cardService: CardService, 
        private pagerService: PagerService,
        private modalService: NgbModal,
        private alertService: AlertService) { }

    ngOnInit() {
        // get dummy data
        this.cardService.getAll()
            .subscribe(data => {
                if(data.status == 'success'){
                    this.allItems = data.result;
                    this.setPage(1);
                }else{
                    alert(data.message);
                }
            });
    }

    updateList(){
         this.cardService.getAll()
            .subscribe(data => {
                if(data.status == 'success'){
                    this.allItems = data.result;
                    this.setPage(1);
                }else{
                    alert(data.message);
                }
            });
    }



     /*
     * image Upload code Start Here
     */
      public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
      }

      public fileOverAnother(e: any): void {
        this.hasAnotherDropZoneOver = e;
      }
   

      /*
     * image Upload code End Here
     */




     open(content) {
        this.modalRef = this.modalService.open(content);
    }

    submit(){
          
        if(this.editIndex == null){
            this.createCard();
        }else{
            this.updateCard();
        }
    }




   setPage(page: number) {
        this.currentPage = page;
        if (page < 1 || page > this.pager.totalPages) { return; }
        this.pager = this.pagerService.getPager(this.allItems.length, page, this.pageSize);
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    deleteCard(index:any){
        this.cardService.delete(this.allItems[index].id)
            .subscribe(data => {
                if(data.status == 'success'){
                    this.allItems.splice(index,1);
                    this.setPage(this.currentPage);
                }else{
                    alert(data.message);
                }
            });
    }

     editCard(index:number, content){
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
 

   createCard(){

 this.uploader.queue[0].upload();
        this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
            this.uploader.clearQueue();  // Clean queue for Upload next Image
            var res = JSON.parse(response);
            if(res.status == 'success'){
                //console.log(res)
                this.model.card = res.result.filename;
                //console.log(this.model)
                 this.cardService.create(this.model)
                    .subscribe(data => {
                        // console.log('insert Card');
                         
                        if( data.status == 'success' ){
                            // console.log(data.result);
                            this.allItems.push(data.result);
                            this.updateList(); // Update list 
                            this.alertService.success('New Card created successfully', true);
                            this.model = {};
                            this.modalRef.close();
                        }else{
                            this.modalRef.close();
                            this.alertService.error(data.message, true);
                        }
                         
                    });

              }
        };


    }
    updateCard(){
         if(this.uploader.queue[0]){
             console.log("With image card");
            this.uploader.queue[0].upload();
            this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
                this.uploader.clearQueue();  // Clean queue for Upload next Image
                var res = JSON.parse(response); 
              if(res.status == 'success'){
                    this.model.card = res.result.filename;
                    // this.cardService.create(this.model)
                    //     .subscribe(data => {   
                        this.cardService.update(this.model)
                        .subscribe(data => {
                           
                            if(data.status == 'success'){
                                this.allItems[this.editIndex]= data.result;
                                this.alertService.success('Card Updated Successfully', true);
                                this.model = {};
                                this.modalRef.close();
                            }else{
                                this.alertService.error(data.message, true);
                            }
                                     
                        });
                             
                   // });


                } 
            };
         }else{
             console.log("No image just Update Card");
                    // delete this.model.card; 
                    //  this.cardService.create(this.model)
                    //     .subscribe(data => {   
                                this.cardService.update(this.model)
                                .subscribe(data => {
                                     console.log(data);
                                    if(data.status == 'success'){
                                        this.allItems[this.editIndex]= data.result;
                                        this.alertService.success('Card Updated Successfully', true);
                                        this.model = {};
                                        this.modalRef.close();
                                    }else{
                                        this.alertService.error(data.message, true);
                                    }
                                     
                                });
                             
                        // });


         }
          
      
           
 









    }














}

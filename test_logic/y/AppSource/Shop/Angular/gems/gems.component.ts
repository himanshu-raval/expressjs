import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';   // for image Upload
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PagerService } from '../../../Default/Angular/shared/components/pager/pager.service';
import { GemsService } from './gems.service';
import { AlertService } from '../../../Default/Angular/shared/components/alert/alert.service';

import { Config } from '../../../Default/Angular/shared/config/app.config';


@Component({
	selector: 'gems-page',
	templateUrl: './gems.component.html',
	styleUrls: ['./gems.component.scss'],
})


export class GemsComponent implements OnInit {
    private allItems: any[];
    pager: any = {};
    model: any = {};
    pageSize:number = 20;
    editIndex:number = null;
    pagedItems: any[];
    currentPage: number;
    modalRef: NgbModalRef;
    url = Config.apiUrl;
    editImage:string;

    /* image Upload */
    public uploader: FileUploader = new FileUploader({ url: Config.apiUrl+'/Shop/Gems/api/upload' });
    public hasBaseDropZoneOver: boolean = false;
    public hasAnotherDropZoneOver: boolean = false;



    constructor(private gemsService: GemsService,
        private pagerService: PagerService, 
        private modalService: NgbModal,
        private alertService: AlertService) { }

    ngOnInit() {


        // this.alertService.success('Registration successful', true);

        this.gemsService.getAll()
        .subscribe(data => {
            console.log(data);
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


     updateList(){
         this.gemsService.getAll()
         .subscribe(data => {
             console.log(data);
             if(data.status == 'success'){
                 this.allItems = data.result;
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
             this.createGems();
         }else{
             this.updateGems();
         }
     }

     setPage(page: number) {
         this.currentPage = page;
         if (page < 1 || page > this.pager.totalPages) { return; }
         this.pager = this.pagerService.getPager(this.allItems.length, page, this.pageSize);
         this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
     }
     editGems(index:number, content){
         index = index + ((this.currentPage -1) * this.pageSize)
         this.model = this.allItems[index];
         this.editIndex = index;
         // this.editImage = this.model.gems;
         // this.model.gems = '';
         this.modalRef = this.modalService.open(content);
         this.modalRef.result.then((result) => {
            //  if(result == 'updated'){
            //      this.editIndex = null;
            //      this.editImage = '';
            //  }else{
            //      this.editIndex = null;
            //      this.editImage = '';
            //      this.model.gems = this.editImage;
            //  }
            this.editIndex = null;
         }, (reason) => {
            //  this.editIndex = null;
            //  this.model.gems = this.editImage;
            //  this.editImage = '';
            this.editIndex = null;
         });
     }

     deleteGems(index:any){
         this.gemsService.delete(this.allItems[index].id)
         .subscribe(data => {
             if(data.status == 'success'){
                 this.allItems.splice(index,1);
                 this.setPage(this.currentPage);
             }else{
                 alert(data.message);
             }
         });
     }
     createGems(){
         this.uploader.queue[0].upload();
         this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
             this.uploader.clearQueue();  // Clean queue for Upload next Image
             var res = JSON.parse(response);
             if(res.status == 'success'){
                 //console.log(res)
                 this.model.gems = res.result.filename;
                 //console.log(this.model)
                 this.gemsService.create(this.model)
                 .subscribe(data => {
                     console.log('insert Gems');
                     if( data.status == 'success' ){
                         console.log('New Gems created successfully');
                         console.log(data.result);
                         this.allItems.push(data.result);
                         this.updateList(); 
                         this.alertService.success('New Gems created successfully', true);
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
     updateGems(){
         if(this.uploader.queue[0]){
             this.uploader.queue[0].upload();
             this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
                 this.uploader.clearQueue();  // Clean queue for Upload next Image
                 var res = JSON.parse(response); 
                 if(res.status == 'success'){
                     this.model.gems = res.result.filename;
                     this.gemsService.update(this.model)
                     .subscribe(data => {
                         // console.log("With Image",data);
                         if(data.status == 'success'){
                             this.allItems[this.editIndex]= data.result;
                             this.alertService.success('Gems Updated Successfully', true);
                             this.model = {};
                             this.modalRef.close();
                         }else{
                             this.alertService.error(data.message, true);
                         }
                         
                     });

                 } 
             };


         }else{
             // delete this.model.gems; 
             this.gemsService.update(this.model)
             .subscribe(data => {
                 if(data.status == 'success'){
                     // console.log("Without images",data);
                     this.allItems[this.editIndex]= data.result;
                     this.alertService.success('Gems Updated Successfully', true);
                     this.model = {};
                     this.modalRef.close('updated');
                 }else{
                     this.alertService.error(data.message, true);
                 }

             });
         }                
     }
 }

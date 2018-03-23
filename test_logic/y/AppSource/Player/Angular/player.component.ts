import { Component, OnInit } from '@angular/core';
import { PagerService } from '../../Default/Angular/shared/components/pager/pager.service';
import { PlayerService } from './player.service';


@Component({
	selector: 'player-page',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss'],
})


export class PlayerComponent implements OnInit {
    private allItems: any[];
    pager: any = {};
    pagedItems: any[];
    currentPage: number;
	constructor(private playerService: PlayerService, private pagerService: PagerService) { }

    ngOnInit() {
        // get dummy data
        this.playerService.getAll()
            .subscribe(data => {
                if(data.status == 'success'){
                    this.allItems = data.result;
                    this.setPage(1);
                }else{
                    alert(data.message);
                }
            });
    }

    setPage(page: number) {
        this.currentPage = page;
        if (page < 1 || page > this.pager.totalPages) { return; }
        this.pager = this.pagerService.getPager(this.allItems.length, page);
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    deletePlayer(index:any){
        this.playerService.delete(this.allItems[index].id)
            .subscribe(data => {
                if(data.status == 'success'){
                    this.allItems.splice(index,1);
                    this.setPage(this.currentPage);
                }else{
                    alert(data.message);
                }
            });
    }

}

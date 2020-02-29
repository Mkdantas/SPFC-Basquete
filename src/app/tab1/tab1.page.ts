import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { WordpressService } from '../services/wordpress.service';
import { NetworkService } from '../services/network.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  sort:number = 0;
  posts = [];
  page = 1;
  count = null;
  show= true;
  constructor(private loadingCtrl: LoadingController, private wp: WordpressService, private network: NetworkService) {

  }
  async ngOnInit(){
    let loading = await this.loadingCtrl.create({
      message:'Carregando...'
    });  

    
    this.wp.getPosts().subscribe( res=> {
      
      console.log('info: ', res);
      this.count = this.wp.totalPosts;
      this.posts = res;
      this.show = false;
    });
 
}
    async refreshNow(event){
      this.wp.getPosts().subscribe( res=> {
      console.log('info: ', res);
      this.count = this.wp.totalPosts;
      this.posts = res;

      event.target.complete();
      });
    }
    async loadMore(event){
      this.page++;
      
      this.wp.getPosts(this.page).subscribe( res=> {
        this.posts = [...this.posts, ...res];

        event.target.complete();

        if(this.page == this.wp.pages){
          event.target.disabled = true;
        }
      });
    }

}

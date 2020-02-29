import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { WordpressService } from '../services/wordpress.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

@Component({
  selector: 'slides-example',
  template: `
    <ion-slides pager="true" [options]="slideOpts">
      <ion-slide>
        <h1>Slide 1</h1>
      </ion-slide>
      <ion-slide>
        <h1>Slide 2</h1>
      </ion-slide>
      <ion-slide>
        <h1>Slide 3</h1>
      </ion-slide>
    </ion-slides>
  `
})
export class Tab2Page implements OnInit {
  postsFuture= [];
  postsPast = [];
  page = 1;
  count= null; 
  show = true;
  sort:number=0;

  slideOpts = {
    initialSlide: 1,
    speed: 400
  }
  constructor(private loadingCtrl: LoadingController, private wp:WordpressService) {;
  }

  async ngOnInit(){
    let loading = await this.loadingCtrl.create({
    });



   



    this.wp.getEventFuture().subscribe(res=> {
      this.count = this.wp.totalPosts;
      this.postsFuture = res;
      this.show = false;
      console.log(res);

      
      
    });

 
  }
  async refreshNowFuture(event){
    this.wp.getEventFuture().subscribe( res=> {
    console.log('info: ', res);
    this.count = this.wp.totalPosts;
    this.postsFuture = res;

    event.target.complete();
    });
  }
  
  async loadMoreFuture(event){
    this.page++;

    let loading = await this.loadingCtrl.create({
    });

    this.wp.getEventFuture(this.page).subscribe(res=> {
      console.log('info: ', res);
      this.postsFuture = [...this.postsFuture, ...res];
      event.target.complete();
      loading.dismiss();

      if(this.page == this.wp.pages){
        event.target.disabled = true;
      }
    });



  }







  async selectfilter(){
    let loading = await this.loadingCtrl.create({
      message: "carregando..."
    });

    loading.present();
    this.wp.getEventFuture().subscribe(res=>{
      this.postsFuture = res;
      loading.dismiss();
      console.log(res);
    })
    
  }
}

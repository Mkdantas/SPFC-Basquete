import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WordpressService } from '../services/wordpress.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-readmore',
  templateUrl: './readmore.page.html',
  styleUrls: ['./readmore.page.scss'],
})
export class ReadmorePage implements OnInit {
  post: any;

  constructor(private route: ActivatedRoute, private loadingCtrl: LoadingController, private wp: WordpressService) { }

 async ngOnInit() {
    let loading = await this.loadingCtrl.create({
      message:'Carregando...'
    });
    await loading.present();
    
    let id = this.route.snapshot.paramMap.get('id');
    this.wp.getPostContent(id).subscribe(res => {
      this.post = res;
      loading.dismiss();
    });
  }
  
  

  openOriginal(){
    window.open(this.post.link, '_blank');
  }

}

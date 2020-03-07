import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { WordpressService } from '../services/wordpress.service';
import { NetworkService } from '../services/network.service';

@Component({
  selector: 'app-tab0',
  templateUrl: './tab0.page.html',
  styleUrls: ['./tab0.page.scss'],
})
export class Tab0Page implements OnInit {
  post: [];
  event = [];
  rest: [];
  tables: any;


  constructor(private loadingCtrl: LoadingController, private wp: WordpressService, private network: NetworkService) { }

 async ngOnInit() {

        this.wp.getTablesHome().subscribe(res=>{
          this.tables = new Array();
          for(const haha in res){
            
            this.tables.push(res[haha])
            console.log(this.tables);
          }
          let sortVariable = [1,2,3,4,5];
          for(let i = 0; i < this.tables.length; i++){
            if(this.tables[i].pos == 1){
              sortVariable.splice(0, 1, this.tables[i]);
            } else if(this.tables[i].pos == 2){
              sortVariable.splice(1, 1, this.tables[i]);
            }else if(this.tables[i].pos == 3){
              sortVariable.splice(2, 1, this.tables[i]);
            }else if(this.tables[i].pos == 4){
              sortVariable.splice(3, 1, this.tables[i]);
            }else if(this.tables[i].pos == 5){
              sortVariable.splice(4, 1, this.tables[i]);
            }
      }
      this.tables = sortVariable;
    });
  

    this.wp.getPostsHome().subscribe(res=>{
      this.post = res;
      console.log(res);
    });

    this.wp.getPosts().subscribe(res=>{
      this.rest = res;
    })
    this.wp.getEventHome().subscribe(res=>{
      this.event = res;
      console.log(this.event);
    })
  }
  
  async selectfilter(){
    let loading = await this.loadingCtrl.create({
      message: "carregando..."
    });
    loading.present();
    this.wp.getEventHome().subscribe(res=>{
      this.event = []
      for(let i = 0; i < res.length; i++){
        if(res[i].teams[0] == 404 || res[i].teams[1] == 404){
          this.event.push(res[i]);
      }
    }
      loading.dismiss();
      console.log(this.event);
    })
    
  }

}

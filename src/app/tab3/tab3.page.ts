import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { WordpressService } from '../services/wordpress.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  sort:number = 0;
  posts =[];
  page = 1;
  count = null;
  show= true;
  sortVariable = [];
  teams = [404, 786, 788, 790, 792, 1214, 1301, 1303, 1305, 1307, 1309,1311,1313,1315,1317,1319];
  constructor(private loadingCtrl: LoadingController, private wp: WordpressService) {
  }

  async ngOnInit(){

    this.wp.getTables().subscribe(res=>{
      
      for(const haha in res){
        this.posts.push(res[`${haha}`]);
        console.log(this.posts);
      }
      let sortVariable = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
      for(let i = 0; i < this.posts.length; i++){
        if(this.posts[i].pos == 1){
          sortVariable.splice(0, 1, this.posts[i]);
        } else if(this.posts[i].pos == 2){
          sortVariable.splice(1, 1, this.posts[i]);
        }else if(this.posts[i].pos == 3){
          sortVariable.splice(2, 1, this.posts[i]);
        }else if(this.posts[i].pos == 4){
          sortVariable.splice(3, 1, this.posts[i]);
        }else if(this.posts[i].pos == 5){
          sortVariable.splice(4, 1, this.posts[i]);
        }else if(this.posts[i].pos == 6){
          sortVariable.splice(5, 1, this.posts[i]);
        }else if(this.posts[i].pos == 7){
          sortVariable.splice(6, 1, this.posts[i]);
        }else if(this.posts[i].pos == 8){
          sortVariable.splice(7, 1, this.posts[i]);
        }else if(this.posts[i].pos == 9){
          sortVariable.splice(8, 1, this.posts[i]);
        }else if(this.posts[i].pos == 10){
          sortVariable.splice(9, 1, this.posts[i]);
        }else if(this.posts[i].pos == 11){
          sortVariable.splice(10, 1, this.posts[i]);
        }else if(this.posts[i].pos == 12){
          sortVariable.splice(11, 1, this.posts[i]);
        }else if(this.posts[i].pos == 13){
          sortVariable.splice(12, 1, this.posts[i]);
        }else if(this.posts[i].pos == 14){
          sortVariable.splice(13, 1, this.posts[i]);
        }else if(this.posts[i].pos == 15){
          sortVariable.splice(14, 1, this.posts[i]);
        }
      }
    
      this.posts = sortVariable;
      this.show = false;
    


    })




  }


}
  
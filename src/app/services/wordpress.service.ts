import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { NetworkService, ConnectionStatus } from './network.service';
import { OfflineManagerService } from './offline-manager.service';
import { from, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class WordpressService {
  url = `https://spfcbasquete.com.br/wp-json/`;
  API_STORAGE_KEY: 'specialkey';
  totalPosts = null;
  pages: any;
  photos: any;
  team1: any;
  team2: any;
  stadium: any;
  sort:number = 0;  
  today = new Date();
  dd = String(this.today.getDate()).padStart(2, '0');
  mm = String(this.today.getMonth() + 1).padStart(2, '0'); //January is 0!
  yyyy = this.today.getFullYear();


  constructor(private http: HttpClient, private networkService: NetworkService, private offlineManager: OfflineManagerService, private storage: Storage) { }

  getPosts(page = 1, forceRefresh: boolean = true): Observable<any>{
    if(this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline || !forceRefresh) {
      return from(this.getLocalData('posts'));
    } else{
    let options = {
      observe: "response" as "body",
      params: {
        per_page: '5',
        page: '' +page
      }

    };
    return this.http.get<any[]>(`${this.url}wp/v2/posts?_embed`, options).pipe(
      map(resp => {
        this.pages = resp['headers'].get('x-wp-totalpages');
        this.totalPosts = resp['headers'].get('x-wp-total');
        
        let data = resp['body'];
        
        for (let post of data) {
          post.media_url = post['_embedded']['wp:featuredmedia'][0]['media_details'].sizes['medium'].source_url;

        }
        return data;
      }),
      tap(resp=>{
        console.log('returns real live api data');
        this.setLocalData('posts', resp);
      })
      );
  
}
}


  private setLocalData(key, data){
    this.storage.set(`${this.API_STORAGE_KEY}-${key}`, data);
  }

  public getLocalData(key){
    console.log('return local data!');
    return this.storage.get(`${this.API_STORAGE_KEY}-${key}`);
  }


  getPostContent(id, forceRefresh: boolean = true): Observable<any>{
    if(this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline || !forceRefresh) {
      return from(this.getLocalData('postsContent'));
    } else{
    return this.http.get(`${this.url}wp/v2/posts/${id}?_embed`).pipe(
      map(post => {
        post['media_url'] = post['_embedded']['wp:featuredmedia'][0]['media_details'].sizes['medium'].source_url;
        return post;
      }),
      tap(res=>{
        console.log('returns real live api data');
        this.setLocalData('postsContent', res);
      })
    );
    }
    }

  

  getEventFuture(page = 1, forceRefresh: boolean = true ): Observable<any>{
    if(this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline || !forceRefresh) {
      return from(this.getLocalData('events'));
    } else{
    let options;
    if(this.sort == 0){
    options = {
      observe: "response" as "body",
      params: {
        per_page: '10',
        page: '' +page,
        order: 'asc',
        after: this.yyyy + '-'+ this.mm+'-' + this.dd + 'T12:50:59'
        
      }

    };
  } else{
    options = {
      observe: "response" as "body",
      params: {
        per_page: '10',
        page: '' +page,
        order: 'desc',
        before: this.yyyy + '-'+ this.mm+'-' + this.dd + 'T12:50:59'
        
      }

    };
  }

    
    return this.http.get<any[]>(`${this.url}sportspress/v2/events?_embed`, options).pipe(
      map(resp => {
        this.pages = resp['headers'].get('x-wp-totalpages');
        this.totalPosts = resp['headers'].get('x-wp-total');


        let data = resp['body'];

        for(let post of data){
          post.team_home = post['teams'][0];
          post.team_visitor = post['teams'][1];
          post.stadium = post['venues'][0];
        }
        for(let team of data){
          this.getStadium(team.stadium).subscribe(res=>{
            this.stadium = res;
            team.stadiumNow = res['name'];
          })
          this.getTeamHome(team.team_home).subscribe(res=>{
            this.team1 = res;
            team.home = res['media_url'];
          });
          this.getTeamVisitor(team.team_visitor).subscribe(res=>{
            this.team2 = res;
            team.visitor = res['media_url'];
          });
        }
        return data;
      }),
      tap(res=>{
        console.log('returns real live api data');
        this.setLocalData('events', res);
      })
    );
    }
  }




  getTeamVisitor(team){
   

    return this.http.get(`${this.url}sportspress/v2/teams/${team}?_embed`).pipe(
      map(resp => {
        switch(team){

          case 404: resp['media_url'] = 'https://i1.wp.com/spfcbasquete.com.br/wp-content/uploads/2019/07/Brasao_do_Sao_Paulo_Futebol_Clube.png?fit=132%2C151&ssl=1'
          
            break;
  
            case 788: resp['media_url'] = 'https://i1.wp.com/spfcbasquete.com.br/wp-content/uploads/2019/07/pinheiros.png?fit=132%2C151&ssl=1'
            break;
  
            case 790: resp['media_url'] = 'https://i1.wp.com/spfcbasquete.com.br/wp-content/uploads/2019/07/franca.png?fit=132%2C151&ssl=1'
            break;
  
            case 792: resp['media_url'] = 'https://i1.wp.com/spfcbasquete.com.br/wp-content/uploads/2019/07/mogi.png?fit=132%2C151&ssl=1'
            break;
  
            case 786: resp['media_url'] = 'https://i1.wp.com/spfcbasquete.com.br/wp-content/uploads/2019/07/1200px-CA_Paulistano.png?fit=132%2C151&ssl=1'
            break;
  
            case 1315:  resp['media_url'] = 'https://i1.wp.com/spfcbasquete.com.br/wp-content/uploads/2019/10/Escudo_do_Minas_Tenis_Clube.svg_.png?fit=132%2C151&ssl=1'
              break;
            
            case 1307: resp['media_url'] = 'https://i1.wp.com/spfcbasquete.com.br/wp-content/uploads/2019/10/Basquete_Cearense.png?fit=132%2C151&ssl=1'
            break;
          default: resp['media_url'] = resp['_embedded']['wp:featuredmedia']['0'].media_details.sizes['full'].source_url;
          }
        return resp;
      }),
  
    );
    

  }
  getTeamHome(team){
  
    return this.http.get(`${this.url}sportspress/v2/teams/${team}?_embed`).pipe(
      map(resp => {

        
        switch(team){

        case 404: resp['media_url'] = 'https://i1.wp.com/spfcbasquete.com.br/wp-content/uploads/2019/07/Brasao_do_Sao_Paulo_Futebol_Clube.png?fit=132%2C151&ssl=1'
        
          break;

          case 788: resp['media_url'] = 'https://i1.wp.com/spfcbasquete.com.br/wp-content/uploads/2019/07/pinheiros.png?fit=132%2C151&ssl=1'
          break;

          case 790: resp['media_url'] = 'https://i1.wp.com/spfcbasquete.com.br/wp-content/uploads/2019/07/franca.png?fit=132%2C151&ssl=1'
          break;

          case 792: resp['media_url'] = 'https://i1.wp.com/spfcbasquete.com.br/wp-content/uploads/2019/07/mogi.png?fit=132%2C151&ssl=1'
          break;

          case 786: resp['media_url'] = 'https://i1.wp.com/spfcbasquete.com.br/wp-content/uploads/2019/07/1200px-CA_Paulistano.png?fit=132%2C151&ssl=1'
          break;

          case 1315:  resp['media_url'] = 'https://i1.wp.com/spfcbasquete.com.br/wp-content/uploads/2019/10/Escudo_do_Minas_Tenis_Clube.svg_.png?fit=132%2C151&ssl=1'
            break;
          
          case 1307: resp['media_url'] = 'https://i1.wp.com/spfcbasquete.com.br/wp-content/uploads/2019/10/Basquete_Cearense.png?fit=132%2C151&ssl=1'
          break;
        default: resp['media_url'] = resp['_embedded']['wp:featuredmedia']['0'].media_details.sizes['full'].source_url;
        }
        return resp;
      }),
  
      
    );
    

  }
  getStadium(venue){

    return this.http.get(`${this.url}sportspress/v2/venues/${venue}?_embed`).pipe(
      map(resp => {
        return resp;
      }),
      
      );

    
    }

    getTables(page = 1, forceRefresh: boolean = true): Observable<any>{
      if(this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline || !forceRefresh) {
        return from(this.getLocalData('tables'));
      } else{
      let options = {
        observe: "response" as "body",
        params: {
          per_page: '16',
          page: '' +page,
        }
  
      };
      
      return this.http.get(`${this.url}sportspress/v2/tables/1322?_embed`, options).pipe(
        map(resp => {

         let data = resp['body']['data'];
          return data;
        }),
        tap(res=>{
          console.log('returns real live api data');
          this.setLocalData('tables', res);
        })
        );
}
}

getPostsHome(page = 1){
  let options = {
    observe: "response" as "body",
    params: {
      per_page: '1',
      page: '' +page
    }

  };
  return this.http.get<any[]>(`${this.url}wp/v2/posts?_embed`, options).pipe(
    map(resp => {
      this.pages = resp['headers'].get('x-wp-totalpages');
      this.totalPosts = resp['headers'].get('x-wp-total');
      
      let data = resp['body'];
      
      for (let post of data) {
        post.media_url = post['_embedded']['wp:featuredmedia'][0]['media_details'].sizes['medium'].source_url;

      }
      return data;
    })
    );


}
getEventHome(page = 1){
  let options;
  if(this.sort == 0){
  options = {
    observe: "response" as "body",
    params: {
      per_page: '1',
      page: '' +page,
      order: 'asc',
      after: this.yyyy + '-'+ this.mm+'-' + this.dd + 'T12:50:59'
      
    }

  };
} else{
  options = {
    observe: "response" as "body",
    params: {
      per_page: '1',
      page: '' +page,
      order: 'desc',
      before: this.yyyy + '-'+ this.mm+'-' + this.dd + 'T12:50:59'
      
    }

  };
}

  
  return this.http.get<any[]>(`${this.url}sportspress/v2/events?_embed`, options).pipe(
    map(resp => {
      this.pages = resp['headers'].get('x-wp-totalpages');
      this.totalPosts = resp['headers'].get('x-wp-total');


      let data = resp['body'];

      for(let post of data){
        post.team_home = post['teams'][0];
        post.team_visitor = post['teams'][1];
        post.stadium = post['venues'][0];
      }
      for(let team of data){
        this.getStadium(team.stadium).subscribe(res=>{
          this.stadium = res;
          team.stadiumNow = res['name'];
        })
        this.getTeamHome(team.team_home).subscribe(res=>{
          this.team1 = res;
          team.home = res['media_url'];
        });
        this.getTeamVisitor(team.team_visitor).subscribe(res=>{
          this.team2 = res;
          team.visitor = res['media_url'];
        });
      }
      return data;
    })
  );
  }
  getTablesHome(page = 1){

    let options = {
      observe: "response" as "body",
      params: {
        per_page: '5',
        page: '' +page,
      }

    };
    
    return this.http.get(`${this.url}sportspress/v2/tables/1322?_embed`, options).pipe(
      map(resp => {

       let data = resp['body']['data'];
        return data;
      }),
      );

}
}



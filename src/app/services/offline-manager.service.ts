import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, forkJoin } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';

const STORAGE_REQ_KEY = 'storedreq';

interface StoredRequest {
  url: string,
  type: string,
  data: any,
  time: number,
  id: string
}

@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {

  constructor(private storage: Storage, private toastController: ToastController, private http: HttpClient) { }

  checkForEvents(): Observable<any> {
    return from(this.storage.get(STORAGE_REQ_KEY)).pipe(
      switchMap(storedOperations => {
        let storedObj = JSON.parse(storedOperations);
        if(storedObj && storedObj.length > 0){
          return this.sendRequests(storedObj).pipe(
            
            finalize(()=> {
              let toast = this.toastController.create({
                message: `local data successfully synced to API`,
                duration: 3000,
                position: 'bottom'
              });
              toast.then(toast => toast.present());
              this.storage.remove(STORAGE_REQ_KEY);
            })
          );
        } else{
          console.log('no local events');
          return of(false);
        }
      })
    );
  }
  
  storeRequest(url, type, data) {
    let toast = this.toastController.create({
      message: `your data is stored locally because you seem to be offline.`,
      duration: 3000,
      position: 'bottom'
    });
    toast.then(toast => toast.present());

    let action: StoredRequest = {
      url: url,
      type: type,
      data: data,
      time: new Date().getTime(),
      id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
    };

    return this.storage.get(STORAGE_REQ_KEY).then(storedOperations => {
      let storedObj = JSON.parse(storedOperations);

      if(storedObj){
        storedObj.push(action);
      } else{
        storedObj = [action];
      }
      console.log('local request stored: ', action);
      return this.storage.set(STORAGE_REQ_KEY, JSON.stringify(storedObj));
    });
  }

  sendRequests(operations: StoredRequest[]){
    let obs= [];

    for(let op of operations){
      console.log('make one request: ', op);
      let oneObs = this.http.request(op.type, op.url, op.data);
      obs.push(oneObs);
    }

    return forkJoin(obs);
  }
}

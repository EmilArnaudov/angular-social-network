import { Injectable } from '@angular/core';
import { collection, Firestore, getDocs, QuerySnapshot, DocumentData } from '@angular/fire/firestore';
import { from, map, mergeMap, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private firestore: Firestore) { }

  searchQuery(query: string): Observable<any> {
    if (!query) {
      return from([]);
    }
    return from(getDocs(collection(this.firestore, 'users'))
      .then(snapshot => {
        let arr: any[] = [];
        snapshot.forEach(docData => {
          let user = docData.data();
          if (user['username'].toLowerCase().includes(query.toLowerCase())) {
            if (arr.length < 5) {
              arr.push(user);
            }
          }
        })
        return arr;
      }))


     
}}

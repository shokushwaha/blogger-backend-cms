import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private afs: AngularFirestore, private toastr: ToastrService) { }

  saveData(data) {
    this.afs.collection('categories').add(data).then(docRef => {
      this.toastr.success('Inserted successfully')
    })
      .catch(err => {
        console.log(err)
      })
  }

  loadData() {
    return this.afs.collection('categories').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        })
      })
    )
  }

  updateData(id, editData) {
    this.afs.collection('categories').doc(id).update(editData).then(docRef => {
      this.toastr.success('Updated successfully')
    })
      .catch(err => {
        console.log(err)
      })
  }

  deleteData(id) {
    this.afs.collection('categories').doc(id).delete().then(docRef => {
      this.toastr.success('Deleted successfully')
    })
      .catch(err => {
        console.log(err)
      })
  }
}

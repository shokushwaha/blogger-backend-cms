import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private afs: AngularFirestore, private storage: AngularFireStorage, private toastr: ToastrService, private router: Router) { }

  uploadImage(selectedImage): Promise<string> {
    return new Promise((resolve, reject) => {
      const filePath = `postImg/${Date.now()}`;

      this.storage.upload(filePath, selectedImage).then(() => {
        console.log("Image uploaded successfully");

        this.storage.ref(filePath).getDownloadURL().subscribe(URL => {
          resolve(URL);
        }, error => {
          reject(error);
        });
      });
    });
  }

  saveData(postData) {
    this.afs.collection('posts').add(postData).then((docRef) => {
      this.toastr.success("Posted successfully");
      this.router.navigate(['/posts']);

    })
  }


  loadData() {
    return this.afs.collection('posts').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        })
      })
    )
  }

  loadOneData(id) {
    return this.afs.collection('posts').doc(id).valueChanges();
  }

  updateData(id, postData) {
    this.afs.collection('posts').doc(id).update(postData).then(() => {
      this.toastr.success("Updated successfully");
      this.router.navigate(['/posts']);
    })
  }

  deleteImage(id, postImgPath) {
    this.storage.storage.refFromURL(postImgPath).delete().then(() => {
      this.deleteData(id);
    })
  }

  deleteData(id) {
    this.afs.collection('posts').doc(id).delete().then(() => {
      this.toastr.warning("Deleted successfully");
    })
  }

  markFeatured(id, featuredData) {
    this.afs.collection('posts').doc(id).update(featuredData).then(() => {
      this.toastr.info("Featured status changed");
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  constructor(private categoryService: CategoriesService) { }

  categoryArr = [];
  formCategory: string
  formStatus: string = "Add"
  categoryId: string

  ngOnInit(): void {
    this.categoryService.loadData().subscribe(val => {
      this.categoryArr = val;
    })
  }

  onSubmit(formData): void {

    let categoryData: Category = {
      category: formData.value.category
    }

    if (this.formStatus == 'Add') {
      this.categoryService.saveData(categoryData);
      formData.reset();
    }
    else if (this.formStatus == 'Edit') {
      this.categoryService.updateData(this.categoryId, categoryData);
      formData.reset();
      this.formStatus = "Add"

    }

  }

  onEdit(id, category) {
    this.formStatus = "Edit"
    this.formCategory = category
    this.categoryId = id
  }

  onDelete(id) {
    this.categoryService.deleteData(id);
  }
}

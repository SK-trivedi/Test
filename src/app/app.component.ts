import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLinear = false;
  urls:any[];
  postUrl:string = 'https://webhook.site/71abe700-4337-4392-a623-f12c96591019'
  finalData:any;

  //forms
  projectDetailsForm: FormGroup;
  projectGalleryForm: FormGroup;
  projectCostForm: FormGroup;
  projectIncludesForm: FormGroup;
  projectDatesForm: FormGroup;


  constructor(
    private _formBuilder: FormBuilder,
    private http:HttpClient,
    private router:Router
    ) {}

  ngOnInit() {
    this.projectDetailsForm = this._formBuilder.group({
      organization: ['', Validators.required],
      category: ['', Validators.required],
      activity: ['', Validators.required],
      title: ['', Validators.required],
      minimumAge: ['', [Validators.required,Validators.min(12)]],
      maximumAge: ['', [Validators.required,Validators.max(52)]],
      overviewDescription: ['', Validators.required]
    });
    this.projectGalleryForm = this._formBuilder.group({
      projectName: ['', Validators.required],
      projectImages: ['']
    });
    this.projectCostForm = this._formBuilder.group({
      projectName: ['', Validators.required],
      projectDurationAndCost: this._formBuilder.array([this._formBuilder.group({
        duration : ['', Validators.required],
        cost : ['', Validators.required]
      })])
    });
    this.projectIncludesForm = this._formBuilder.group({
      projectName: ['', Validators.required],
      include: this._formBuilder.array([this._formBuilder.group({
        includeDescription : ['', Validators.required],
        isIncluded : ['', Validators.required]
      })])
    });
    this.projectDatesForm = this._formBuilder.group({
      projectName: ['', Validators.required],
      projectStartDates: this._formBuilder.array([new Date()])
    });
  }

  onClickProjectDetails(){
    console.log(this.projectDetailsForm.value);
    
  }


  onSelectImages(event){
    const files:any[] = event.target.files;
    console.log(files);
    console.log(this.projectGalleryForm.value);

    this.urls = [];
    let filesArray = event.target.files;
    if (filesArray) {
      for (let file of filesArray) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.urls.push(e.target.result);
          console.log(this.urls);
          
        }
        reader.readAsDataURL(file);
      
    }
  }

  this.projectGalleryForm.patchValue({projectImages:this.urls})

  }

  get getProjectDurationAndCost(){
    return this.projectCostForm.get('projectDurationAndCost') as FormArray
  }

  get getProjectIncludeDetails(){
    return this.projectIncludesForm.get('include') as FormArray
  }

  get getProjectStartDates(){
    return this.projectDatesForm.get('projectStartDates') as FormArray
  }

  addRow(){
    this.getProjectDurationAndCost.push(
      this._formBuilder.group({
        duration:'',
        cost:''
      })
      )
  }

  addIncludeRow(){
    this.getProjectIncludeDetails.push(
      this._formBuilder.group({
        includeDescription:'',
        isIncluded:''
      })
      )
  }

  addDateRow(){
    this.getProjectStartDates.push(new FormControl())
  }

  removeRow(i){
    this.getProjectDurationAndCost.removeAt(i)
  }

  removeIncludeRow(i){
    this.getProjectIncludeDetails.removeAt(i)
  }

  removeDateRow(i){
    this.getProjectStartDates.removeAt(i)
  }


  onclickFinish(){

    if(this.projectDatesForm.invalid) return

    const requestObject = {
  
      details:this.projectDetailsForm.value,
      gallery:this.projectGalleryForm.value,
      cost:this.projectCostForm.value,
      include:this.projectIncludesForm.value,
      dates:this.projectDatesForm.value,
    
    }
    console.log({requestObject});
    this.finalData = requestObject;

    alert('Form submitted!')
    this.http.post(this.postUrl,requestObject).subscribe(res=>console.log(res),err=>alert(err.statusText))
    
    // this.router.navigateByUrl('/view');    
  }
  
}

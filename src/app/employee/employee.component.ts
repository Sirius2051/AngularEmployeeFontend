import { Component, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

    constructor(private http:HttpClient) { }

    departments: any = [];
    employees: any = [];

    modalTitle = "";
    EmployeeId = 0;
    EmployeeName = "";
    Department = "";
    DateOfJoin = "";
    PhotoFileName = "picture.png";
    PhotoPath = environment.PHOTO_URL;

    EmployeeIdFilter = "";
    EmployeeNameFilter = "";
    DepartmentFilter = "";
    DateOfJoinFilter = "";
    employeesWithoutFilter:any = [];

    ngOnInit(): void {
        this.refreshList();
    }

    refreshList(){
        this.http.get<any>(environment.API_URL+'employee')
        .subscribe(data=>{
            this.employees=data;
            this.employeesWithoutFilter = data;
        });
        this.http.get<any>(environment.API_URL+'department')
        .subscribe(data=>{
            this.departments=data;
        });
    }

    addClick(){
        this.modalTitle = "Add Employee";
        this.EmployeeId = 0;
        this.EmployeeName = "";
        this.Department = "";
        this.DateOfJoin = "";
        this.PhotoFileName = "Ilustracion-SpaceInvaders-1024x1024.png";
    }

    editClick(emp:any){
        this.modalTitle = "Add Employee";
        this.EmployeeId = emp.EmployeeId;
        this.EmployeeName = emp.EmployeeName;
        this.Department = emp.Department;
        this.DateOfJoin = emp.DateOfJoin;
        this.PhotoFileName = emp.PhotoFileName;
    }
    createClick(){
        var val = {
            EmployeeName:this.EmployeeName,
            Department:this.Department,
            DateOfJoin:this.DateOfJoin,
            PhotoFileName:this.PhotoFileName
        };
        this.http.post(environment.API_URL+'employee', val)
        .subscribe(res=>{
            alert(res.toString());
            this.refreshList();
        });
    }
    updateClick(){
        var val = {
            EmployeeId:this.EmployeeId,
            EmployeeName:this.EmployeeName,
            Department:this.Department,
            DateOfJoin:this.DateOfJoin,
            PhotoFileName:this.PhotoFileName
        };
        this.http.put(environment.API_URL+'employee', val)
        .subscribe(res=>{
            alert(res.toString());
            this.refreshList();
        });
    }
    deleteClick(id:any){
        if(confirm('Are you sure?')){
            this.http.delete(environment.API_URL+'employee/'+id)
            .subscribe(res=>{
                alert(res.toString());
                this.refreshList();
            });
        }
    }
    imageUpload(event:any){
        var file = event.target.files[0];
        const formData:FormData = new FormData();
        formData.append('file', file, file.name);

        this.http.post(environment.API_URL+'employee/savefile', formData)
        .subscribe((data:any)=>{
            this.PhotoFileName = data.toString();
        });
    }
    FilterFn(){
        var EmployeeIdFilter = this.EmployeeIdFilter;
        var EmployeeNameFilter = this.EmployeeNameFilter;
        var DepartmentFilter = this.DepartmentFilter;
        var DateOfJoinFilter = this.DateOfJoinFilter;

        this.employees = this.employeesWithoutFilter.filter(
            function(el:any){
                return el.EmployeeId.toString().toLowerCase().includes(
                    EmployeeIdFilter.toString().trim().toLowerCase()
                )&&
                el.EmployeeName.toString().toLowerCase().includes(
                    EmployeeNameFilter.toString().trim().toLowerCase()) &&
                el.Department.toString().toLowerCase().includes(
                    DepartmentFilter.toString().trim().toLowerCase()) &&
                el.DateOfJoin.toString().toLowerCase().includes(
                    DateOfJoinFilter.toString().trim().toLowerCase())
            }
        )

    }

    sortResult(prop:any, asc:any){
        this.employees = this.employeesWithoutFilter.sort(function(a:any, b:any){
            if(asc){
                return (a[prop]>b[prop])?1:((a[prop]<b[prop])?-1:0);
            }
            else{
                return (b[prop]>a[prop])?1:((b[prop]<a[prop])?-1:0);
            }
        });
    }

  }

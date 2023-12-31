import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {NgModel} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Dialog} from "@angular/cdk/dialog";
import {AddInventoryComponent} from "../add-inventory/add-inventory.component";
import {UpdateInventoryComponent} from "../update-inventory/update-inventory.component";
import {MatDialog} from "@angular/material/dialog";
import {Route, Router} from "@angular/router";


interface InventoryItem {
  type: string;
  brand: string;
  price: number;
  date : Date;
}

@Component({
  selector: 'app-search-inventory',
  templateUrl: './search-inventory.component.html',
  styleUrls: ['./search-inventory.component.css']
})
export class SearchInventoryComponent implements AfterViewInit{

  pageNum :number=0;
  displayedColumns: string[] = ['type', 'brand', 'price', 'description','date','actions'];
  dataSource: MatTableDataSource<InventoryItem>;
  constructor(private route:Router,private http:HttpClient,public dialog:MatDialog) {

    this.dataSource = new MatTableDataSource<InventoryItem>([]);

  }

  @ViewChild(MatPaginator) paginator: MatPaginator|undefined;


ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
}

  hasMoreResults: boolean = true
  type:string[]=[];
  brands:string[]=[];
  description: string="";
  // onSearchInventory(){
  //
  //   const typeString = this.type.join(',');
  //   const brandsString = this.brands.join(',');
  //   console.log(typeString);
  //   console.log(brandsString);
  //
  //   this.http.get(`http://localhost:8080/inventory?brands=${brandsString}&types=${typeString}&description=${this.description}&page=${this.pageNum}&limit=5`,{ responseType: 'json' }).subscribe((resultData:any)=>{
  //
  //     console.log(resultData);
  //     this.dataSource.data = resultData.content;
  //
  //   });
  // }
  //
  // onMore(){
  //
  //   this.pageNum = this.pageNum+1;
  //
  //   const typeString = this.type.join(',');
  //   const brandsString = this.brands.join(',');
  //
  //   this.http.get(`http://localhost:8080/inventory?brands=${brandsString}&types=${typeString}&description=${this.description}&page=${this.pageNum}&limit=5`,{ responseType: 'json' }).subscribe((resultData:any)=>{
  //
  //     console.log(resultData);
  //     this.dataSource.data = resultData.content;
  //
  //   });
  //
  // }

  onSearchInventory() {
    this.pageNum = 0; // Reset page number when initiating a new search
    this.loadResults();
  }

  onMore() {
    this.pageNum++;
    this.loadResults();
  }

  loadResults() {
    const typeString = this.type.join(',');
    const brandsString = this.brands.join(',');


    this.http.get(`http://localhost:8080/inventory?brands=${brandsString}&types=${typeString}&description=${this.description}&page=${this.pageNum}&limit=5`, { responseType: 'json' })
      .subscribe((resultData: any) => {
        console.log(resultData);

        if (this.pageNum === 0) {
          this.dataSource.data = resultData.content;
        } else {
          this.dataSource.data = [...this.dataSource.data, ...resultData.content];
        }

        this.hasMoreResults = resultData.totalPages > this.pageNum + 1;

      });
  }

  onClear() {

    this.type = [];
    this.brands = [];
    this.description = "";
    this.dataSource.data = [];
  }

  onDelete(inveId:number){

    this.http.delete(`http://localhost:8080/inventory?inveId=${inveId}`,{ responseType: 'json' }).subscribe((resultData:any)=>{

      console.log(resultData);
      this.onSearchInventory();

    });

  }

  onUpdateInventoryPopup(inveId:number){

    console.log(inveId);
    const dialogRef= this.dialog.open(UpdateInventoryComponent,{width:'600px',data: { itemId: inveId}});

  }

  onChange(){
    this.route.navigateByUrl('/dashboard');
  }

}

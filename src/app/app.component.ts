import { Component } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  data: Array<any> = [];
  dataReady: boolean = false;
  headers: Array<any> = [
    "PAYROLL PROVIDER", "WORKER", "COMPLIANCE SCORE", "GROSS PAY(£)", "PAYROLL ADMIN(£)", "LABOUR COST(£)", "WORK FORCE"
  ];
  total: any;
  sortedColumnIndex: number;
  currentSortDirection: number = -1;

  constructor(private http: HttpClient) {
    this.http.get("http://localhost:6502/application/labourstats").subscribe((response) => {
      var responseData = JSON.parse(JSON.stringify(response));
      for (let provider of responseData[0].providers) {
        provider.dataType = 'provider';
        this.data.push(provider);
      }
      for (let directContractor of responseData[0].directContractors) {
        directContractor.dataType = 'directContractor';
        this.data.push(directContractor);
      }
      this.total = responseData[0].total[0];
      this.dataReady = true;
    })
  }

  isEmpty(item: any) {
    try {
      if (item === undefined) return true;
      if (typeof item === undefined) return true;
      if (item === null) return true;
      if (item === '') return true;
      if (item.length === 0) return true;
      return false;
    } catch (e) {
      return true;
    }
  }

  getClass(i: number) {
    var className = '' + (i + 1) + (this.isEmpty(this.sortedColumnIndex) ? '' : this.sortedColumnIndex === i ? ' sortedcol' : '');
    if (!this.isEmpty(this.sortedColumnIndex) && this.sortedColumnIndex === i  )
    className += this.currentSortDirection === -1? ' desc' : ' asc';
    if (i===0) className += ' frozen'; 
    return className;
  }

  sort(columnIndex: any) {
    if (this.sortedColumnIndex !== columnIndex) {
      this.sortedColumnIndex = columnIndex;
      this.currentSortDirection = 1;
    } else {
      this.sortedColumnIndex = columnIndex;
      this.currentSortDirection = -this.currentSortDirection;
    }
    switch (columnIndex) {
      case 0:

        this.data.sort((a, b) => {
          return (a.dataType === b.dataType) ? (a.name.toUpperCase() > b.name.toUpperCase() ? this.currentSortDirection ^ 1 : this.currentSortDirection ^ -1) : (a.dataType === 'directContractor' ? -1 : 1);
        })
        break;
      case 1:
        this.data.sort((a, b) => {
          return a.workerCount > b.workerCount ? this.currentSortDirection ^ 1 : this.currentSortDirection ^ -1;
        });
        break;
      case 2:
        this.data.sort((a, b) => {

          if (this.isEmpty(a.complianceStats)) return this.currentSortDirection ^ -1;
          if (this.isEmpty(b.complianceStats)) return this.currentSortDirection ^ 1;
          return a.complianceStats.Total > b.complianceStats.Total ? this.currentSortDirection ^ 1 : this.currentSortDirection ^ -1;
        });
        break;
      case 3:

        this.data.sort((a, b) => {
          return a.grossPayTotal > b.grossPayTotal ? this.currentSortDirection ^ 1 : this.currentSortDirection ^ -1;
        })

        break;
      case 4:

        this.data.sort((a, b) => {
          return a.payrollAdminTotal > b.payrollAdminTotal ? this.currentSortDirection ^ 1 : this.currentSortDirection ^ -1;
        });

        break;
      case 5:
        this.data.sort((a, b) => {
          return a.labourCostTotal > b.labourCostTotal ? this.currentSortDirection ^ 1 : this.currentSortDirection ^ -1;
        });
        break;
      case 6:
        this.data.sort((a, b) => {
          return a.workerCount > b.workerCount ? this.currentSortDirection ^ 1 : this.currentSortDirection ^ -1;
        });
        break;
      default:
        break;

    }

  }
}

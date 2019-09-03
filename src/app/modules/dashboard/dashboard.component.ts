import { Component, OnInit } from "@angular/core";
import { AuthService, InvoiceService } from "../../shared/services";
import { Chart } from "chart.js";
import { Iuser, Iinvoice } from "src/app/shared/models";
import * as moment from "moment";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  currentUser: Iuser;
  invoices: Iinvoice[];
  maxDate: Date;
  startDate: Date;
  endDate: Date;
  minDate: Date;
  chart: any;
  collectedAmount: number;
  invoicedAmount: number;
  itemLoading: string;
  graphData: {
    labels: Array<string>;
    invoicesData: Array<number>;
    paymentsData: Array<number>;
  };
  constructor(
    private authService: AuthService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit() {
    this.itemLoading = "Loading...";
    this.graphData = {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
      invoicesData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      paymentsData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
    this.collectedAmount = 0;
    this.invoicedAmount = 0;
    const userPromise: Promise<Iuser> = this.authService.getUserDetails();
    const invoicePromise: Promise<
      Iinvoice[]
    > = this.invoiceService.getInvoiceStore();
    Promise.all([userPromise, invoicePromise])
      .then(result => {
        this.currentUser = result[0];
        this.invoices = result[1];
        if (this.invoices.length === 0) {
          this.itemLoading = "No Data Found";
        } else {
          this.startDate = this.currentUser.company.subscriptionStartDate;
          this.minDate = this.currentUser.company.subscriptionStartDate;
          this.maxDate = new Date();
          this.endDate = new Date();
          for (let inv of this.invoices) {
            this.collectedAmount += inv.amountPaid;
            this.invoicedAmount += inv.total;
          }
          this.createBarGraph();
          this.filterData();
        }
      })
      .catch(err => console.log(err));
  }
  createBarGraph() {
    this.chart = new Chart("dash-bar-graph", {
      type: "bar",
      data: {
        labels: this.graphData.labels,
        datasets: [
          {
            backgroundColor: "rgba(66, 165, 245, .7)",
            borderColor: "rgba(69, 39, 160, .7)",
            data: this.graphData.invoicesData,
            label: "Invoices Rs",
            fill: "false"
          },
          {
            backgroundColor: "rgba(38, 166, 154, .7)",
            borderColor: "rgba(69, 39, 160, .7)",
            data: this.graphData.paymentsData,
            label: "Payments Rs",
            fill: "false"
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: `Invoiced: Rs ${this.invoicedAmount}      Collected: Rs ${this.collectedAmount}`
        }
      }
    });
  }
  dateChange(type: string, event: Date): void {
    console.log(type, event);
    if (type === "start") {
      this.startDate = event;
      if (this.endDate) {
        this.filterData();
      }
    }
    if (type === "end") {
      this.endDate = event;
      if (this.startDate) {
        this.filterData();
      }
    }
  }
  filterData(): void {
    this.graphData.labels = [];
    this.graphData.invoicesData = [];
    this.graphData.paymentsData = [];
    const diff = moment(this.endDate).diff(this.startDate, "d");
    let currentDate = moment(this.startDate);
    let nextDate = moment(this.startDate);
    if (diff <= 13) {
      nextDate.add(1, "d");
      for (let i = 0; i <= diff; i++) {
        this.graphData.labels.push(currentDate.format("MMM DD"));
        this.graphData.invoicesData[i] = 0;
        this.graphData.paymentsData[i] = 0;
        for (let inv of this.invoices) {
          if (
            moment(inv.createdAt) <= nextDate &&
            moment(inv.createdAt) >= currentDate
          ) {
            this.graphData.invoicesData[i] += inv.total;
            this.graphData.paymentsData[i] += inv.amountPaid;
          }
        }
        currentDate = nextDate;
        nextDate = moment(currentDate).add(1, "d");
      }
    } else if (diff <= 69) {
      const weekday = currentDate.weekday();
      weekday === 0 ? nextDate.add(1, "d") : nextDate.add(8 - weekday, "d");
      for (let i = 0; i < Math.ceil(diff / 7); i++) {
        this.graphData.labels.push(currentDate.format("MMM DD"));
        this.graphData.invoicesData[i] = 0;
        this.graphData.paymentsData[i] = 0;
        for (let inv of this.invoices) {
          if (
            moment(inv.createdAt) <= nextDate &&
            moment(inv.createdAt) >= currentDate
          ) {
            this.graphData.invoicesData[i] += inv.total;
            this.graphData.paymentsData[i] += inv.amountPaid;
          }
        }
        currentDate = nextDate;
        nextDate = moment(currentDate).add(7, "d");
      }
    } else if (diff <= 365) {
      nextDate = nextDate.endOf("month");
      for (let i = 0; i < Math.ceil(diff / 28); i++) {
        console.log(currentDate.format("MMM DD"), nextDate.format("MMM DD"));
        this.graphData.labels.push(currentDate.format("MMM"));
        this.graphData.invoicesData[i] = 0;
        this.graphData.paymentsData[i] = 0;
        for (let inv of this.invoices) {
          if (
            moment(inv.createdAt) <= nextDate &&
            moment(inv.createdAt) >= currentDate
          ) {
            this.graphData.invoicesData[i] += inv.total;
            this.graphData.paymentsData[i] += inv.amountPaid;
          }
        }
        currentDate = moment(nextDate.add(1, "d"));
        nextDate = moment(currentDate).endOf("month");
      }
    }else {
      nextDate = nextDate.endOf("year");
      for (let i = 0; i < Math.ceil(diff / 365); i++) {
        this.graphData.labels.push(currentDate.format("YYYY"));
        this.graphData.invoicesData[i] = 0;
        this.graphData.paymentsData[i] = 0;
        for (let inv of this.invoices) {
          if (
            moment(inv.createdAt) <= nextDate &&
            moment(inv.createdAt) >= currentDate
          ) {
            this.graphData.invoicesData[i] += inv.total;
            this.graphData.paymentsData[i] += inv.amountPaid;
          }
        }
        currentDate = moment(nextDate.add(1, "d"));
        nextDate = moment(currentDate).endOf("year");
      }
    }
    if (this.chart) {
      this.chart.data.labels = this.graphData.labels;
      this.chart.data.datasets[0].data = this.graphData.invoicesData;
      this.chart.data.datasets[1].data = this.graphData.paymentsData;
      this.chart.update();
    } else {
      this.createBarGraph();
    }
  }
}

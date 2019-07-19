import { Component, OnInit, OnDestroy } from "@angular/core";
import { MediaObserver, MediaChange } from "@angular/flex-layout";
import { Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { ItemDialogComponent, DialogConfig } from "../dialogs";
import { IlineItem } from "../models";
import { MatTableDataSource } from "@angular/material";

const ITEM_DATA: IlineItem[] = [
  {
    id: 1,
    name: "abc",
    description: "this is a test item",
    unitCost: 100,
    taxable: true
  },
  {
    id: 2,
    name: "work",
    description: "thai adf kladjf kladjf kladfj akldfa klsdfakls ",
    unitCost: 100,
    taxable: true
  },
  {
    id: 3,
    name: "iphone",
    description: "If you do not have an iphone,you do not have an iphone",
    unitCost: 100000,
    taxable: true,
  },
  {
    id: 4,
    name: "qwerty",
    description: "this is a blackberry phone",
    unitCost: 10000,
    taxable: false
  }
];
@Component({
  selector: "app-item",
  templateUrl: "./item.component.html",
  styleUrls: ["./item.component.scss"]
})
export class ItemComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<IlineItem>;
  currentScreenWidth: string = "";
  flexMediaWatcher: Subscription;
  displayedColumns: string[];
  constructor(
    private mediaObserver: MediaObserver,
    private dialog: MatDialog
  ) {}
  ngOnInit() {
    this.dataSource = new MatTableDataSource(ITEM_DATA);
    // resize table as device resized
    this.flexMediaWatcher = this.mediaObserver.media$.subscribe(
      (mediaChange: MediaChange) => {
        if (mediaChange.mqAlias !== this.currentScreenWidth) {
          this.currentScreenWidth = mediaChange.mqAlias;
          this.configTable();
        }
      }
    );
  }

  configTable() {
    this.displayedColumns = [
      "name",
      "description",
      "unitCost",
      "taxable",
      "action"
    ];
    if (this.currentScreenWidth === "xs" || this.currentScreenWidth === "sm") {
      this.displayedColumns = ["name", "unitCost","taxable", "action"];
    }
  }
  addNewItem(): void {
    DialogConfig.data = null;
    const dialogRef = this.dialog.open(ItemDialogComponent, DialogConfig);
    dialogRef
      .afterClosed()
      .toPromise()
      .then(
        result => {
          if(result){
            result.id = ITEM_DATA.length + 1;
            ITEM_DATA.push(result);
            this.dataSource.data = ITEM_DATA;
          }
        },
        err => console.log(err)
      );
  }
  editItem(item: IlineItem): void {
    DialogConfig.data = item;
    const dialogRef = this.dialog.open(ItemDialogComponent, DialogConfig);
    dialogRef
      .afterClosed()
      .toPromise()
      .then(
        result => {
          if(result){
            for(let item of ITEM_DATA){
              if(item.id === result.id){
                item.name = result.name;
                item.description = result.description;
                item.taxable = result.taxable;
                item.type = result.type;
                item.unitCost = result.unitCost;
              }
            }
          }
        },
        err => console.log(err)
      );
  }
  deleteItem(index: number): void {
    ITEM_DATA.splice(index,1);
    this.dataSource.data = ITEM_DATA;
  }
  ngOnDestroy() {
    this.flexMediaWatcher.unsubscribe();
  }
}

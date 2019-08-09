import { Component, OnInit, OnDestroy } from "@angular/core";
import { MediaObserver, MediaChange } from "@angular/flex-layout";
import { Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { ItemDialogComponent, DialogConfig } from "../../shared/dialogs";
import { IlineItem } from "../../shared/models";
import { MatTableDataSource } from "@angular/material";
import { ItemService } from "src/app/shared/services";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-item",
  templateUrl: "./item.component.html",
  styleUrls: ["./item.component.scss"]
})
export class ItemComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<IlineItem>;
  currentScreenWidth: string = "";
  flexMediaWatcher: Subscription;
  itemSubscription: Subscription;
  dialogRefSubscription: Subscription;
  displayedColumns: string[];
  items: IlineItem[];
  itemLoading: string;
  constructor(
    private mediaObserver: MediaObserver,
    private dialog: MatDialog,
    private itemService: ItemService,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.itemLoading = "loading...";
    this.items = [];
    this.dataSource = new MatTableDataSource(this.items);
    this.getAllItems();
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
  getAllItems(): void {
    // this.itemSubscription = this.itemService.itemStore$.subscribe(
    //   items => {
    //     if (items) {
    //       this.items = items;
    //       this.dataSource.data = this.items;
    //       if (items.length === 0) {
    //         this.itemLoading = "No Item Found";
    //       }
    //     } else {
    //       this.itemService
    //         .getItems()
    //         .toPromise()
    //         .then(items => {
    //           this.items = items;
    //           this.dataSource.data = this.items;
    //           if (items.length === 0) {
    //             this.itemLoading = "No Item Found";
    //           }
    //         })
    //         .catch(err => {
    //           console.log(err);
    //           this.toastr.error("faild to load items", "Server Error");
    //         });
    //     }
    //   },
    //   err => {
    //     console.log(err);
    //     this.toastr.error("faild to load items", "Server Error");
    //   }
    // );
    this.itemService.getItemStore((err, items) => {
      if (err) {
        console.log(err);
        this.toastr.error("faild to load items", "Server Error");
      } else {
        this.items = items;
        this.dataSource.data = this.items;
        if (items.length === 0) {
          this.itemLoading = "No Item Found";
        }
      }
    });
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
      this.displayedColumns = ["name", "unitCost", "taxable", "action"];
    }
  }
  addNewItem(): void {
    DialogConfig.data = null;
    const dialogRef = this.dialog.open(ItemDialogComponent, DialogConfig);
    this.dialogRefSubscription = dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.items.push(result);
          this.dataSource.data = this.items;
        }
      },
      err => console.log(err)
    );
  }
  editItem(item: IlineItem): void {
    DialogConfig.data = item;
    const dialogRef = this.dialog.open(ItemDialogComponent, DialogConfig);
    this.dialogRefSubscription = dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          for (let item of this.items) {
            if (item.id === result.id) {
              item.name = result.name;
              item.description = result.description;
              item.taxable = result.taxable;
              item.unitCost = result.unitCost;
            }
          }
          this.toastr.success("Item is updated!");
        }
      },
      err => console.log(err)
    );
  }
  deleteItem(index: number, id: string): void {
    console.log(id);
    this.itemSubscription = this.itemService.deleteItem(id).subscribe(
      () => {
        this.items.splice(index, 1);
        this.dataSource.data = this.items;
        this.toastr.success("Item is deleted!");
      },
      err => {
        console.log(err);
        this.toastr.error("Failed to delete Item!", "Server error");
      }
    );
  }
  ngOnDestroy() {
    if (this.flexMediaWatcher) this.flexMediaWatcher.unsubscribe();
    if (this.itemSubscription) this.itemSubscription.unsubscribe();
    if (this.dialogRefSubscription) this.dialogRefSubscription.unsubscribe();
  }
}

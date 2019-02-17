import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, interval } from "rxjs";
import { map } from "rxjs/operators";
import { Item } from "./item";
import { ItemService } from "./item.service";

@Component({
  selector: "ns-items",
  moduleId: module.id,
  templateUrl: "./items.component.html",
  styles: [
    `
      .grey {
        background-color: #cecece;
      }

      .flips {
        vertical-align: center;
        horizontal-align: center;
      }
    `
  ]
})
export class ItemsComponent implements OnInit {
  public readonly flipListViews$ = new BehaviorSubject<boolean>(false);
  public readonly flipBtnLabel$ = this.flipListViews$.pipe(
    map(flipListViews =>
      flipListViews ? "Stop flipping listviews" : "Start flipping listviews"
    )
  );
  public readonly flips$ = new BehaviorSubject<number>(0);

  public readonly activeListView$ = combineLatest(
    interval(1000),
    this.flipListViews$
  ).pipe(map(([i, flipListViews]) => (flipListViews ? i % 2 : 0)));

  items: Array<Item>;

  // This pattern makes use of Angular’s dependency injection implementation to
  // inject an instance of the ItemService service into this class.
  // Angular knows about this service because it is included in your app’s main NgModule,
  // defined in app.module.ts.
  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.items = this.itemService.getItems();
  }

  public toggleFlipListViews() {
    this.flipListViews$.next(!this.flipListViews$.value);
  }

  public listViewLoaded() {
    if (this.flipListViews$.value) {
      this.flips$.next(this.flips$.value + 1);
    }
  }
}

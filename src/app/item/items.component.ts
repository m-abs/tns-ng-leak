import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, interval } from "rxjs";
import { map } from "rxjs/operators";
import { Item } from "./item";
import { ItemService } from "./item.service";

declare function gc(): void;

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
  ).pipe(
    map(([i, flipListViews]) => {
      if (!flipListViews) {
        return 0;
      }

      if (i % 2 == 0) {
        return 0;
      }

      return 1;
    })
  );

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
      const flips = this.flips$.value + 1;
      this.flips$.next(flips);

      console.log(`${flips} flip`);
    }

    if (typeof gc === 'function'){
        gc();
    }
  }
}

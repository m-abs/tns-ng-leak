import { Component, OnInit, NgZone, OnDestroy } from "@angular/core";
import { BehaviorSubject, combineLatest, interval, Subscription } from "rxjs";
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
export class ItemsComponent implements OnInit, OnDestroy {
  public readonly flipListViews$ = new BehaviorSubject<boolean>(false);
  public readonly flipBtnLabel$ = this.flipListViews$.pipe(
    map(flipListViews =>
      flipListViews ? "Stop flipping listviews" : "Start flipping listviews"
    )
  );
  public readonly flips$ = new BehaviorSubject<number>(0);

  public readonly activeListView$ = new BehaviorSubject<0 | 1>(0);
  public sub: Subscription;

  items: Array<Item>;

  // This pattern makes use of Angular’s dependency injection implementation to
  // inject an instance of the ItemService service into this class.
  // Angular knows about this service because it is included in your app’s main NgModule,
  // defined in app.module.ts.
  constructor(private itemService: ItemService, private zone: NgZone) {}

  public ngOnInit(): void {
    this.items = this.itemService.getItems();

    // this.toggleFlipListViews();
  }

  public ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;
    }
  }

  public toggleFlipListViews() {
    const newValue = !this.flipListViews$.value;
    this.flipListViews$.next(newValue);

    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;
    }

    if (!newValue) {
      return;
    }

    // this.zone.run(() => this.activeListView$.next(this.activeListView$.value === 0 ? 1 : 0));

    this.sub = combineLatest(interval(500), this.flipListViews$)
      .pipe(
        map(([i, flipListViews]) => {
          if (!flipListViews) {
            return 0;
          }

          if (i % 25 === 0) {
            if (typeof gc === "function") {
              console.log(`GC()`);
              gc();
            }
          }

          if (i >= 1000) {
            this.sub.unsubscribe();
            this.sub = null;
          }

          if (i % 2 == 0) {
            return 0;
          }

          return 1;
        })
      )
      .subscribe(v => this.zone.run(() => this.activeListView$.next(v)));
  }

  public listViewLoaded() {
    if (this.flipListViews$.value) {
      const flips = this.flips$.value + 1;
      this.flips$.next(flips);

      console.log(`${flips} flip`);
    }
  }
}

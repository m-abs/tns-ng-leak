import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, interval, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { Item } from "./item";
import { ItemService } from "./item.service";
import * as nsApp from "tns-core-modules/application";

declare function gc(something?: boolean): void;
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

  private flipStart: Date;

  // This pattern makes use of Angular’s dependency injection implementation to
  // inject an instance of the ItemService service into this class.
  // Angular knows about this service because it is included in your app’s main NgModule,
  // defined in app.module.ts.
  constructor(private itemService: ItemService, private zone: NgZone) {}

  public ngOnInit(): void {
    this.items = this.itemService.getItems();
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

    this.flipStart = new Date();
    console.log(`FLIP START`);

    this.flips$.next(1);

    this.printMemoryUsage();

    this.sub = combineLatest(interval(100), this.flipListViews$)
      .pipe(
        map(([i, flipListViews]) => {
          if (!flipListViews) {
            return 0;
          }

          if (i > 0 && i % 25 === 0) {
            if (typeof gc === "function") {
              console.time(`GC()`);
              gc(true);
              gc();
              this.printMemoryUsage();
              console.timeEnd(`GC()`);
            }
          }

          if (i >= 10000) {
            this.sub.unsubscribe();
            this.sub = null;

            console.log(`${Date.now() - Number(this.flipStart)}ms - FLIP ENDS`);
          }

          return i % 2;
        })
      )
      .subscribe(v => this.zone.run(() => this.activeListView$.next(v)));
  }

  public listViewLoaded() {
    if (this.flipListViews$.value) {
      const flips = this.flips$.value + 1;
      this.flips$.next(flips);
    }
  }

  public printMemoryUsage() {
    if (!!android) {
      const mi = new android.app.ActivityManager.MemoryInfo();
      const activityManager = nsApp.android.context.getSystemService(
        android.content.Context.ACTIVITY_SERVICE
      );

      activityManager.getMemoryInfo(mi);

      const usedMemory = ((mi.totalMem - mi.availMem) / 1024 / 1024).toFixed(2);
      const totalMem = (mi.totalMem / 1024 / 1024).toFixed(2);
      const availMem = (mi.availMem / 1024 / 1024).toFixed(2);

      const numFlips = this.flips$.value;

      const flipTime = Date.now() - Number(this.flipStart);
      console.log(
        `${flipTime}ms. ${numFlips}x flips. Used: ${usedMemory}MB. Total: ${totalMem}MB. Available: ${availMem}MB.`
      );
    }
  }
}

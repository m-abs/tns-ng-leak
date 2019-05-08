import { Component, Input, OnDestroy } from "@angular/core";
import { Item } from "./item";

@Component({
  moduleId: module.id,
  selector: "ns-item-row, [ns-item-row]",
  template: `
    <Label [nsRouterLink]="['/item', item.id]" [text]="item.name"></Label>
  `
})
export class ItemRowComponent implements OnDestroy {
  @Input() public item: Item;

  ngOnDestroy(): void {
    /*
    console.log(
      `${this.constructor.name}.ngOnDestroy() - ${this.item && this.item.id}`
    );
    */
  }
}

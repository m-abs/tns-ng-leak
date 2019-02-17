import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import * as nsApp from "tns-core-modules/application";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ItemDetailComponent } from "./item/item-detail.component";
import { ItemsComponent } from "./item/items.component";
import * as trace from 'tns-core-modules/trace'
import * as ngTrace from 'nativescript-angular/trace';

/* trace.enable()
trace.setCategories([
    ngTrace.rendererTraceCategory,
    ngTrace.viewUtilCategory,
].join(',')) */

for (const eventName of [
  nsApp.lowMemoryEvent,
  nsApp.uncaughtErrorEvent,
  // nsApp.discardedErrorEvent
]) {
  nsApp.on(eventName, (evt: nsApp.ApplicationEventData) => {
    console.log(`---- ${eventName} ----`);
    for (const [key, value] of Object.entries(evt)) {
      console.log(`${key} = ${value}`);
    }

    console.log(`---- END of ${eventName} ----`);
  });
}

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
// import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, AppRoutingModule],
  declarations: [AppComponent, ItemsComponent, ItemDetailComponent],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule {}

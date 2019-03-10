// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";

import { AppModule } from "./app/app.module";
import { enableProdMode } from "@angular/core";
import * as app from "tns-core-modules/application";
enableProdMode();

function logEvent(eventName: string, stack: string) {
  console.log(`--- START - [${eventName}] ---`)
  stack.split(`\n`).forEach((line) => console.log(line));
  console.log(`--- END   - [${eventName}] ---`)
}

for (const [key, eventName] of Object.entries(app)) {
  if (!/Event$/.test(key) || typeof eventName !== "string") {
    continue;
  }

  app.on(eventName, () => {
    logEvent(eventName, new Error().stack);
  });
}

if (app.android) {
  for (const [key, eventName] of Object.entries(app.AndroidApplication)) {
    if (!/Event$/.test(key) || typeof eventName !== "string") {
      continue;
    }

    app.android.on(eventName, () => {
      logEvent(eventName, new Error().stack);
    });
  }
}

// A traditional NativeScript application starts by initializing global objects,
// setting up global CSS rules, creating, and navigating to the main page.
// Angular applications need to take care of their own initialization:
// modules, components, directives, routes, DI providers.
// A NativeScript Angular app needs to make both paradigms work together,
// so we provide a wrapper platform object, platformNativeScriptDynamic,
// that sets up a NativeScript application and can bootstrap the Angular framework.
platformNativeScriptDynamic().bootstrapModule(AppModule);

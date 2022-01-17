import { enableProdMode, NgZone } from '@angular/core';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Router, NavigationStart } from '@angular/router';
import { ɵAnimationEngine as AnimationEngine } from '@angular/animations/browser';

import { singleSpaAngular, getSingleSpaExtraProviders } from 'single-spa-angular';


import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { singleSpaPropsSubject } from './single-spa/single-spa-props';

if (environment.production) {
  enableProdMode();
}

const lifecycles = singleSpaAngular({
  bootstrapFunction: singleSpaProps => {
    singleSpaPropsSubject.next(singleSpaProps);
    return platformBrowserDynamic(getSingleSpaExtraProviders()).bootstrapModule(AppModule);
  },
  template: '<quality-assurance-root />',
  Router,
  NgZone,
  AnimationEngine,
});
async function mountCompleted(): Promise<void> {
  await Promise.resolve();
  manageCssScope(true);
}
async function unmountCompleted(): Promise<void> {
  await Promise.resolve();
  manageCssScope(false);
}
function manageCssScope(isMount: boolean): void {
  const attribute = "media";
  const value = "not all";
  const styleTags = document.querySelectorAll("style");
  styleTags.forEach(element => {
    if (element.innerText.includes('64b0174e2ccde90ff90cd4f1c12fd80fe881eeba')) {
      if (isMount)
        element.setAttribute(attribute, value);
      else
        element.removeAttribute("media");
    }
  });
}
export const bootstrap = lifecycles.bootstrap;
export const mount = [lifecycles.mount, mountCompleted];
export const unmount = [lifecycles.unmount, unmountCompleted];

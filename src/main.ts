import { enableProdMode, ɵresetCompiledComponents } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from '@app/app.module';
import { environment } from './environments/environment';

declare var module: any;
if (module['hot']) {
    module['hot'].accept();
    module['hot'].dispose(() => ɵresetCompiledComponents());
}

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));

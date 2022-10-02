import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA, } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "@app/app.component";
import { AppRoutingModule } from "@app/app.routing";
import { SharedModule } from "@shared/shared.module";
import { CoreModule } from "@core/core.module";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { ACCESS_TOKEN } from "@shared/configs";
import { ToasterModule } from "angular2-toaster";
import {
    FacebookLoginProvider,
    GoogleLoginProvider,
    MicrosoftLoginProvider,
    SocialAuthServiceConfig,
    SocialLoginModule
} from "angularx-social-login";

import "jquery";
import { SecureStorageService } from '@shared/services/SecureStorage.service';
import { environment } from '../environments/environment';
import { MessageService, MessageServiceComponent } from '@shared/components/message';
import { StoreModule } from '@ngrx/store';
import { progressBarReducer } from '@app/store/reducers/progress-bar.reducer';

export function tokenGetter() {
    return localStorage.getItem(ACCESS_TOKEN);
}

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CoreModule,
        SharedModule,
        ScrollingModule,
        AppRoutingModule,
        SocialLoginModule,
        ToasterModule.forRoot(),
        StoreModule.forRoot({ progressBar: progressBarReducer }),
    ],
    declarations: [AppComponent, MessageServiceComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    providers: [
        MessageService,
        {
            provide: "SocialAuthServiceConfig",
            useValue: {
                autoLogin: true,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(environment.googleAppId),
                    },
                    {
                        id: FacebookLoginProvider.PROVIDER_ID,
                        provider: new FacebookLoginProvider(environment.facebookAppId)
                    },
                    {
                        id: MicrosoftLoginProvider.PROVIDER_ID,
                        provider: new MicrosoftLoginProvider(environment.microsoftAppId, {
                            authority: 'https://login.microsoftonline.com/common/',
                        })
                    }
                ]
            } as SocialAuthServiceConfig
        },
        SecureStorageService,
        {
            provide: APP_INITIALIZER,
            useFactory: (ds: SecureStorageService) => () => ds.init(),
            deps: [SecureStorageService],
            multi: true
        }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}

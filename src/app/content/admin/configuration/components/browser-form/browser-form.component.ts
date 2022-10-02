import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Browser } from '@app/shared/models';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserService } from '@app/core/services';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
    selector: 'app-browser-form',
    templateUrl: './browser-form.component.html',
    styleUrls: ['./browser-form.component.scss']
})
export class BrowserFormComponent implements OnInit {

    browser: Browser;
    browserForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private browserService: BrowserService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private configurationService: ConfigurationService
    ) {
        this.browserForm = this.fb.group({
            name: ['', Validators.required],
            value: ['', Validators.required]
        });

        if (data) {
            this.browser = data.browser;
            if (this.browser) {
                this.browserForm.patchValue(this.browser);
            }
        }
    }

    ngOnInit() {
    }

    onBrowserSaveClick() {
        this.browser = { ...this.browser, ...this.browserForm.value };
        if (this.browser.browserId) {
            this.browserService.updateBrowser(this.browser).subscribe();
            this.configurationService.browserUpdated(this.browser)
        } else {
            this.browserService.addBrowser(this.browser).subscribe();
            this.configurationService.browserCreated(this.browser)
        }
    }

    onBrowserCancelClick() {
        this.browserForm.reset();
    }

}

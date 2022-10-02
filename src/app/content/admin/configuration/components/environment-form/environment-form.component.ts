import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Environment } from "@app/shared/models";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { EnvironmentService } from "@app/core/services";
import { ConfigurationService } from "../../services/configuration.service";

@Component({
    selector: "app-environment-form",
    templateUrl: "./environment-form.component.html",
    styleUrls: ["./environment-form.component.scss"],
})
export class EnvironmentFormComponent implements OnInit {
    environment: Environment;
    environmentForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private environmentService: EnvironmentService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private configurationService: ConfigurationService
    ) {
        this.environmentForm = this.fb.group({
            name: ["", Validators.required],
            value: ["", Validators.required],
        });

        if (data) {
            this.environment = data.environment;
            if (this.environment) {
                this.environmentForm.patchValue(this.environment);
            }
        }
    }

    ngOnInit() {
    }

    onEnvironmentSaveClick() {
        this.environment = { ...this.environment, ...this.environmentForm.value };
        if (this.environment.environmentId) {
            this.environmentService.updateEnvironment(this.environment).subscribe();
            this.configurationService.environmentUpdated(this.environment);
        } else {
            this.environmentService.addEnvironment(this.environment).subscribe();
            this.configurationService.environmentCreated(this.environment);
        }
    }

    onEnvironmentCancelClick() {
        this.environmentForm.reset();
    }
}

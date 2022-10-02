import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProjectInfoModel } from "@shared/models/";
import { CommonService, GlobalService, ProjectService } from "@core/services/";
import { MessageService } from "@app/shared/components/message/messageService.service";
import { MatDialog } from "@angular/material/dialog";

@Component({
    selector: "app-project-info-dialog",
    templateUrl: "project-information-dialog.html",
})
export class ProjectInfoDialogComponent implements OnInit, OnDestroy {
    projectInfoForm: FormGroup;
    projectInfo: ProjectInfoModel = new ProjectInfoModel();

    submitted = false;
    sub: any = null;

    constructor(
        private _fb: FormBuilder,
        private projectService: ProjectService,
        private globalService: GlobalService,
        private messageService: MessageService,
        public dialog: MatDialog,
        private readonly commonService: CommonService
    ) {
        this.projectInfoForm = this._fb.group({
            description: ["", Validators.compose([Validators.required])],
            projectName: ["", Validators.compose([Validators.required])],
            isEnabled: [true],
        });

        this.sub = this.globalService.goal.subscribe((res) => {
            if (res.flag === "project") {
                if (res.orgId) {
                    this.projectInfo.orgId = res.orgId;
                } else {
                    const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
                    this.projectInfo.orgId = organizationAndProjectIds?.organizationId;
                }
            } else {
                this.projectInfo = res;
            }
        });
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.projectInfoForm.controls;
    }

    ngOnInit() {
    }

    submit() {
        this.submitted = true;

        if (this.projectInfoForm.invalid) {
            return;
        }

        if (this.projectInfo.id) {
            this.projectService
                .update(this.projectInfo.id, this.projectInfo)
                .subscribe((result) => {
                    this.messageService.showMessage({
                        timeout: 2000,
                        type: "success",
                        title: "",
                        body: result.details,
                    });
                    this.globalService.changeGoal("Project Saved");
                    this.dialog.closeAll();
                    this.projectInfoForm.reset();
                });
        } else {
            this.projectService.store(this.projectInfo).subscribe((result) => {
                this.messageService.showMessage({
                    timeout: 2000,
                    type: "success",
                    title: "",
                    body: result.details,
                });
                this.globalService.changeGoal("Project Saved");
                this.dialog.closeAll();
                this.projectInfoForm.reset();
            });
        }
    }

    ngOnDestroy() {
        if (this.sub !== undefined) {
            this.sub.unsubscribe();
        }
    }
}

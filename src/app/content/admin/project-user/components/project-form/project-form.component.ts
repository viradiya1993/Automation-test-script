import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { toggleResponse } from "@app/core/helpers";
import { CommonService, ProjectService } from "@app/core/services";
import { Project, ProjectInfoModel } from "@app/shared/models";
import { ProjectUserService } from "../../services/project-user.service";
import { MessageService } from '@shared/components/message';

@Component({
    selector: "app-project-form",
    templateUrl: "./project-form.component.html",
})
export class ProjectFormComponent implements OnInit, AfterViewInit {
    projectFormGroup: FormGroup;
    projectInfo: ProjectInfoModel = new ProjectInfoModel();

    @Input() project: Project;
    @Output() closeMenu = new EventEmitter();
    @Output() reload = new EventEmitter();

    constructor(
        private _fb: FormBuilder,
        private projectService: ProjectService,
        private projectUserService: ProjectUserService,
        private messageService: MessageService,
        private readonly commonService: CommonService
    ) {
        this.projectFormGroup = this._fb.group({
            projectName: ["", Validators.compose([Validators.required])],
            description: [""],
            isEnabled: [true],
        });
    }

    ngOnInit() {
        if (this.project) {
            this.projectFormGroup.patchValue(this.project);
        }
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngOnChanges() {
        if (this.project) {
            this.projectFormGroup.patchValue(this.project);
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (this.project) {
                this.projectFormGroup.patchValue(this.project);
            }
        }, 1500);
    }

    onProjectSaveClick() {
        if (this.projectFormGroup.invalid) {
            return;
        }

        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        this.projectInfo.orgId = organizationAndProjectIds?.organizationId

        if (this.project && this.project.id) {
            this.projectService
                .update(this.project.id, this.projectInfo)
                .subscribe((data: any) => {
                    this.projectUserService.projectUpdated(data);
                    toggleResponse(this.messageService, data);
                });
        } else {
            this.projectService.store(this.projectInfo).subscribe((data: any) => {
                this.projectUserService.projectCreated(data);
                toggleResponse(this.messageService, data);
            }, (error => {
                if (error?.error?.status === 500 && error?.error?.validationErrors?.length === 0) {
                    this.reload.emit();
                }
            }));
        }

        if (!this.project) {
            this.formResetClose();
            this.projectFormGroup.controls["isEnabled"].setValue(true);
        }
    }

    onProjectCancelClick() {
        this.closeMenu.emit();
        this.projectFormGroup.patchValue(this.project);
    }

    changeTab(projectName, projectDescription, projectToggle, projectSaveBtn, projectCancelBtn) {
        const active = document.activeElement;
        projectToggle = projectToggle._elementRef.nativeElement.querySelector('input');
        projectSaveBtn = projectSaveBtn._elementRef.nativeElement;
        projectCancelBtn = projectCancelBtn._elementRef.nativeElement;

        if (active == projectName) {
            projectDescription.focus();
        }
        if (active == projectDescription) {
            projectToggle.focus();
        }
        if (active == projectToggle) {
            projectSaveBtn.focus();
        }
        if (active == projectSaveBtn) {
            projectCancelBtn.focus();
        }
        if (active == projectCancelBtn) {
            projectName.focus();
        }
    }

    private formResetClose() {
        this.projectFormGroup.reset();
        this.closeMenu.emit();
    }
}

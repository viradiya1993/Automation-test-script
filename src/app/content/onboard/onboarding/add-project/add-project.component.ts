import { IOnboardProjectInfo } from './../../onboard.model';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: "app-add-onboard-project-info",
    templateUrl: "./add-project.component.html",
    styleUrls: ["./add-project.component.scss"],
})

export class AddProjectComponent implements OnInit {
    @Output() next = new EventEmitter<null>();

    public projectInfoForm: FormGroup;
    public submitted = false;

    constructor(
        private fb: FormBuilder,
    ) {
    }

    get f() {
        return this.projectInfoForm.controls;
    }

    ngOnInit() {
        const projectInfo = sessionStorage.getItem('project-info') ?
            JSON.parse(sessionStorage.getItem('project-info')) : {}
        this.projectInfoForm = this.fb.group({
            projectName: [projectInfo?.name, Validators.compose([Validators.required])],
            description: [projectInfo?.description],
        });
    }

    public addProject() {
        this.submitted = true;
        if (this.projectInfoForm.invalid) {
            return false;
        }

        const projectInfo: IOnboardProjectInfo = {
            name: this.projectInfoForm.get('projectName').value,
            description: this.projectInfoForm.get('description').value
        };
        sessionStorage.setItem('project-info', JSON.stringify(projectInfo))
        this.next.next();
    }
}


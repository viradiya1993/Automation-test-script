import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestSuite } from '@app/shared/models';
import { NotificationService, TestSuiteService } from '@app/core/services';
import { MatMenuTrigger } from '@angular/material/menu';
import { TestSuiteFilterService } from '../../services/test-suite-filter.service';

@Component({
    selector: 'app-test-suite-form',
    templateUrl: './test-suite-form.component.html',
    styleUrls: ['./test-suite-form.component.scss']
})
export class TestSuiteFormComponent implements OnInit, AfterViewInit {

    @ViewChild('testSuiteFormMatTrigger') testSuiteFormMatTrigger: MatMenuTrigger;

    testSuite: TestSuite;
    testSuiteForm: FormGroup;

    constructor(private fb: FormBuilder, private testSuiteService: TestSuiteService,
                private notificationService: NotificationService, private testSuiteFilterService: TestSuiteFilterService) {
        this.testSuiteForm = this.fb.group({
            name: ['', Validators.required],
            description: ['']
        });
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    onTestSuiteSaveClick() {
        this.testSuite = { ...this.testSuite, ...this.testSuiteForm.value };
        this.testSuite.testScripts = [];
        this.testSuiteService.addTestSuite(this.testSuite).subscribe((result) => {
            this.testSuite.testSuiteId = result["id"];
            this.testSuiteFilterService.testSuiteAdded(this.testSuite);
            this.testSuiteForm.reset();
            this.testSuite = null;
            this.notificationService.showNotification('Test Suite added successfully', 'top');
            this.testSuiteFormMatTrigger.closeMenu();
        });
    }

    onTestSuiteCancelClick() {
        this.testSuiteForm.reset();
        this.testSuiteFormMatTrigger.closeMenu();
    }

}

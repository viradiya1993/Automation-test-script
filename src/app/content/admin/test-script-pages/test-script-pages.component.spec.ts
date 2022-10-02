import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TestScriptPagesComponent } from './test-script-pages.component';

describe('TestScriptPagesComponent', () => {
    let component: TestScriptPagesComponent;
    let fixture: ComponentFixture<TestScriptPagesComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [TestScriptPagesComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestScriptPagesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

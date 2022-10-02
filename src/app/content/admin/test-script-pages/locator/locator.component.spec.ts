import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LocatorComponent } from './locator.component';

describe('LocatorComponent', () => {
    let component: LocatorComponent;
    let fixture: ComponentFixture<LocatorComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [LocatorComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LocatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

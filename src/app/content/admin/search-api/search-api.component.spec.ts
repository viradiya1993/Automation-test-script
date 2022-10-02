import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchApiComponent } from './search-api.component';

describe('SearchApiComponent', () => {
    let component: SearchApiComponent;
    let fixture: ComponentFixture<SearchApiComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [SearchApiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchApiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

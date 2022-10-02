import { Component, DoCheck, ElementRef, KeyValueDiffers, OnInit, ViewChild } from '@angular/core';
import { GlobalService, LocatorService, TemplateService } from '../../../core/services';

@Component({
    selector: 'app-search-api',
    templateUrl: './search-api.component.html',
    styleUrls: ['./search-api.component.scss']
})
export class SearchApiComponent implements OnInit, DoCheck {
    @ViewChild('selectedOption') selectedOption: ElementRef;
    @ViewChild('dynamicTitle') dynamicTitle: ElementRef;
    posts: any [] = [];
    getOptions: any[] = [];
    pages: any[] = [];
    locator: any[] = [];
    selected = false;
    title: any;
    locatorTitle = '';
    differ: any;

    constructor(
        private differs: KeyValueDiffers,
        private templateService: TemplateService,
        private locatorService: LocatorService,
        private globalService: GlobalService
    ) {
        // this.differ = this.differs.find({}).create();
    }

    // http://localhost:4200/components/searchapi
    ngDoCheck() {
        // const change = this.differ.diff(this);
        // if (change) {
        //   change.forEachChangedItem(item => {
        //   });
        // }
    }

    ngOnInit() {
        this.globalService.changeGoal('Search API');
    }

    getSearch() {
        this.templateService.updateTemplate(this.title);
        this.templateService.getLinks().subscribe((posts: any) => {
            this.getOptions = posts;
        });
    }

    setLocatorEditable() {
        this.templateService.getPage().subscribe((pages: any) => {
            this.pages = pages.content
        });
    }

    editSelected(text) {
        if (text.includes('{{ui-locator}}')) {
            text = text.replace('{{ui-locator}}', `<span id="ui-locator"> ` + `{{locatorTitle}}` + `</span>`);
        }
        return '<p>' + text + '</p>';
    }

    onSelect(title) {
        this.getOptions = [];
        this.selected = true;
        this.locatorTitle = 'uiLocator';
        const divideStr = title.split('{{ui-locator}}');
        this.selectedOption.nativeElement.insertAdjacentHTML('beforebegin', divideStr[0])
        this.selectedOption.nativeElement.insertAdjacentHTML('afterend', divideStr[1])
        this.getOptions = [];
    }

    onSelectPage(page) {
        this.locatorTitle = page.pageName
        this.pages = []
        this.locatorService.getLocatorById(page.pageId).subscribe((locator: any) => {
            this.locator = locator.content
        });
    }

    onSelectLocator(locator) {
        this.locatorTitle = locator.locatorName
        this.locator = []
    }

    onClick() {
        if (!this.selected) {
            this.posts.push(this.title);
            this.title = '';
        } else {
            this.posts.push(this.dynamicTitle.nativeElement.innerText);
            this.title = '';
            this.locatorTitle = ''
            this.dynamicTitle.nativeElement.value = ''
        }
        this.selected = false;

    }
}

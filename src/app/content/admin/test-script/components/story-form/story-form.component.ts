import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { EpicService, NotificationService, StoryService } from '@app/core/services';
import { Epic, Story } from '@app/shared/models';
import { of } from 'rxjs';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { FilterService } from '../../services/filter.service';

@Component({
    selector: 'app-story-form',
    templateUrl: './story-form.component.html',
    styleUrls: ['./story-form.component.scss']
})
export class StoryFormComponent implements OnInit, AfterViewInit {
    @ViewChild('storyFormMatTrigger') storyFormMatTrigger: MatMenuTrigger;
    @ViewChild('epicFormMatTrigger') epicFormMatTrigger: MatMenuTrigger;

    @Input() linkBtn = false;
    @Input() editIconBtn = false;
    @Input() disableStoryAddBtn = false;

    @Input() story: Story = undefined;
    storyForm: FormGroup = this.fb.group({
        epicId: ['', Validators.required],
        name: ['', Validators.required],
        summary: ['']
    });
    epics: Epic[] = [];
    searchEpicsCtrl = new FormControl('', [Validators.required]);
    isLoading = false;

    epic: Epic;
    epicForm: FormGroup = this.fb.group({
        name: ['', Validators.required],
        summary: ['']
    });

    constructor(
        private fb: FormBuilder,
        private storyService: StoryService,
        private epicService: EpicService,
        private notificationService: NotificationService,
        public filterService: FilterService
    ) {
        this.storyForm = this.fb.group({
            epicId: ['', Validators.required],
            name: ['', Validators.required],
            summary: ['']
        });
        this.epicForm = this.fb.group({
            name: ['', Validators.required],
            summary: ['']
        });
    }

    setStoryForEdit() {
        if (this.story) {
            this.storyForm.patchValue(this.story);
        }
    }

    ngOnInit() {
        this.searchEpicsCtrl.valueChanges
            .pipe(
                debounceTime(500),
                tap(() => {
                    this.epics = [];
                }),
                switchMap(filterValue => {
                    if (filterValue !== 'createNewEpic') {
                        if (typeof filterValue === "string" && filterValue.length > 0) {
                            this.isLoading = true;
                            return this.epicService.getEpics(filterValue)
                                .pipe(
                                    finalize(() => {
                                        this.isLoading = false
                                    }),
                                );
                        } else {
                            return of(null);
                        }
                    } else {
                        return of(null);
                    }
                })
            )
            .subscribe(res => {
                if (!res) {
                    this.epics = [];
                } else {
                    this.epics = res['data'];
                }
            });
    }

    getSelectedEpic(epic: Epic | string) {
        if (epic !== 'createNewEpic') {
            this.storyForm.patchValue({ 'epicId': epic['epicId'] });
        }
    }

    onEpicCancelClick() {
        this.epicForm.reset();
        this.epicFormMatTrigger.closeMenu();
    }

    onEpicSaveClick() {
        this.epic = { ...this.epic, ...this.epicForm.value };
        this.epicService.addEpic(this.epic).subscribe((result) => {
            this.epicForm.reset();
            this.notificationService.showNotification('Epic created successfully', 'top');
            this.epicFormMatTrigger.closeMenu();
            this.storyFormMatTrigger.closeMenu();
        });
    }

    ngAfterViewInit(): void {
        this.storyFormMatTrigger?.menuOpened.subscribe(() => {
            if (this.filterService.appliedFilter.epic) {
                this.storyForm.patchValue({ 'epicId': this.filterService.appliedFilter.epic.epicId });
            }
        });
    }

    public displayFn(epic: Epic): string {
        return epic?.name || '';
    }

    onStoryCancelClick() {
        this.reset();
        this.storyFormMatTrigger.closeMenu();
        this.isLoading = false;
    }

    onStorySaveClick() {
        this.story = { ...this.story, ...this.storyForm.value };
        if (this.story.storyId) {
            this.storyService.updateStory(this.story).subscribe(() => {
                this.savePostActions(false);
            });
        } else {
            this.storyService.addStory(this.story).subscribe((result) => {
                this.savePostActions(true);
            });
        }
    }

    savePostActions(isCreated: Boolean) {
        this.reset();
        this.notificationService.showNotification(`Story ${isCreated ? 'created' : 'updated'} successfully`, 'top');
        this.storyFormMatTrigger.closeMenu();
        this.filterService.filter();
    }

    reset() {
        this.storyForm.reset();
        this.searchEpicsCtrl.setValue('');
    }

    changeStoryTab(storySelect, storyName, storySaveBtn, storyCancelBtn) {
        const active = document.activeElement;
        storySaveBtn = storySaveBtn._elementRef.nativeElement;
        storyCancelBtn = storyCancelBtn._elementRef.nativeElement;
        if (active == storySelect) {
            storyName.focus();
        }
        if (active == storyName) {
            storySaveBtn.focus();
        }
        if (active == storySaveBtn) {
            storyCancelBtn.focus();
        }
        if (active == storyCancelBtn) {
            storySelect.focus();
        }
    }

    changeEpicTab(epicName, epicSummary, epicSaveBtn, epicCancelBtn) {
        const active = document.activeElement;
        epicSaveBtn = epicSaveBtn._elementRef.nativeElement;
        epicCancelBtn = epicCancelBtn._elementRef.nativeElement;
        if (active == epicName) {
            epicSummary.focus();
        }
        if (active == epicSummary) {
            epicSaveBtn.focus();
        }
        if (active == epicSaveBtn) {
            epicCancelBtn.focus();
        }
        if (active == epicCancelBtn) {
            epicName.focus();
        }
    }

}

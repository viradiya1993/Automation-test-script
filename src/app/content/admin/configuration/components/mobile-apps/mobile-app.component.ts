import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MobileApp } from "@app/shared/models";
import * as moment from "moment";

const MOBILE_APPS_DATA: MobileApp[] = [
    {
        id: 1,
        appName: "octopod",
        appVersion: "v1.0.0",
        fileType: "APK",
        file: "octopod-1.0.0.apk",
        createdAt: moment().subtract(160).format("DD-MM-YYYY").toString(),
    },
    {
        id: 1,
        appName: "octopod",
        appVersion: "v1.1.1",
        fileType: "APK",
        file: "octopod-1.1.1.apk",
        createdAt: moment().subtract(90).format("DD-MM-YYYY").toString(),
    },
    {
        id: 1,
        appName: "octopod",
        appVersion: "v1.2.0",
        fileType: "APK",
        file: "octopod-1.2.0.apk",
        createdAt: moment().subtract(45).format("DD-MM-YYYY").toString(),
    },
    {
        id: 1,
        appName: "octopod",
        appVersion: "v1.3.0",
        fileType: "APK",
        file: "octopod-1.3.0.apk",
        createdAt: moment().format("DD-MM-YYYY").toString(),
    },
];

@Component({
    selector: "app-mobile-apps",
    templateUrl: "./mobile-app.component.html",
    styleUrls: ["./mobile-app.component.scss"],
})
export class MobileAppComponent implements AfterViewInit {
    mobileApps = new MatTableDataSource(MOBILE_APPS_DATA);
    resultsLength: number = MOBILE_APPS_DATA.length || 0;
    pageSize = 10;
    pageSizeOptions: number[] = [10, 20, 50, 100];
    displayedColumns: string[] = [
        "appName",
        "appVersion",
        "fileType",
        "file",
        "actions",
    ];
    mobileAppForm: FormGroup;

    @ViewChild(MatSort) sort: MatSort;

    constructor(private fb: FormBuilder) {
        this.mobileAppForm = this.fb.group({
            files: ["", Validators.required],
        });
    }

    ngAfterViewInit() {
        this.mobileApps.sort = this.sort;
    }

    editMobileApp(mobileApp: MobileApp) {
        console.log(mobileApp);
    }

    setMobileAppToRemove(mobileApp: MobileApp) {
        console.log(mobileApp);
    }

    onImportFileChange(evt) {
        const target: DataTransfer = <DataTransfer>evt.target;
        const isValidFile = !!target.files[0].name.match(/(.xls|.xlsx|.csv)/);

        if (isValidFile) {
            const reader: FileReader = new FileReader();
            reader.onload = (e: any) => {
                /* read workbook */
                // const bstr: string = e.target.result;
                // const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
                /* grab first sheet */
                // const wsname: string = wb.SheetNames[0];
                // const ws: XLSX.WorkSheet = wb.Sheets[wsname];
                /* save data */
                // data = XLSX.utils.sheet_to_json(ws);
            };

            //   reader.readAsBinaryString(target.files[0]);

            reader.onloadend = (e) => {
                // this.keys = Object.keys(data[0]);
                // this.rowData = data;
            };
        }
        // this.inputImportFile.nativeElement.value = "";
    }
}

import { Component } from '@angular/core';
import * as _ from 'lodash';

@Component({
    selector: 'app-ag-grid-action-cell-renderer',
    templateUrl: './ag-grid-action-cell-renderer.component.html',
    styleUrls: ['./ag-grid-action-cell-renderer.component.scss']
})
export class AgGridActionCellRendererComponent {

    params: any;
    editable = false;

    agInit(params: any): void {
        this.params = params;
    }

    onDeleteRow() {
        if (this.params.api) {
            this.params.api.updateRowData({ remove: [this.params.node.data] });
        }
    }

    onCancelEditing() {
        if (this.params.api) {
            this.params.api.stopEditing();
            //this.params.api.undoCellEditing();
            this.editable = false;
        }
    }

    onStartEditing() {
        if (this.params.api) {
            this.params.api.startEditingCell({
                rowIndex: this.params.rowIndex,
                colKey: this.getColumns()[1]
            });
            this.editable = true;
        }
    }

    onStopEditing() {
        if (this.params.api) {
            this.params.api.stopEditing();
            this.editable = false;
        }
    }

    getColumns() {
        if (this.params.columnApi) {
            return _.pull(_.map(this.params.columnApi.getAllGridColumns(), 'colId'), '0');
        }
        return [];
    }

}

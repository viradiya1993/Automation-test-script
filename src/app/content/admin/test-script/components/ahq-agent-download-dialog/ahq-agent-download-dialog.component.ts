import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../../../../environments/environment';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-ahq-agent-download-dialog',
    templateUrl: './ahq-agent-download-dialog.component.html',
    styleUrls: ['./ahq-agent-download-dialog.component.scss']
})
export class AhqAgentDownloadDialogComponent {
    agents = environment.agents.map((agent: any) => {
        agent.agentIcon = this.getIcon(agent.icon);
        return agent;
    }) as any[];

    constructor(
        private dialogRef: MatDialogRef<AhqAgentDownloadDialogComponent>) {
    }

    getIcon(agentIcon: string, hover = false) {
        return `assets/img/${hover ? (agentIcon + '-hover') : agentIcon}.svg`;
    }

    onMouseOver(agent) {
        this.agents = this.agents.map((a: any) => {
            if (a.id === agent.id) {
                a.agentIcon = this.getIcon(agent.icon, true);
            }
            return a;
        });
    }

    onMouseLeave(agent) {
        this.agents = this.agents.map((a: any) => {
            if (a.id === agent.id) {
                a.agentIcon = this.getIcon(agent.icon, false);
            }
            return a;
        });
    }

    capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    onCloseClick(): void {
        this.dialogRef.close(false);
    }

    downloadAgent(agentLink: string) {
        saveAs(agentLink);
    }
}

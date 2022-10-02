import { Component } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-ahq-agent-download',
    templateUrl: './ahq-agent-download.component.html',
    styleUrls: ['./ahq-agent-download.component.scss']
})
export class AhqAgentDownloadComponent {
    agents = environment.agents.map((agent: any) => {
        agent.agentIcon = this.getIcon(agent.icon);
        return agent;
    }) as any[];

    constructor() {
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

    downloadAgent(agentLink: string) {
        saveAs(agentLink);
    }
}

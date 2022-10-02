import { Component, EventEmitter, Output } from "@angular/core";
import { environment } from '../../../../../environments/environment';
import { saveAs } from 'file-saver';

@Component({
    selector: "app-ahq-agent",
    templateUrl: "./ahq-agent.component.html",
    styleUrls: ["./ahq-agent.component.scss"]
})
export class AHQAgentComponent {
    @Output() next = new EventEmitter<null>();
    @Output() back = new EventEmitter<null>();

    agents = environment.agents.map((agent: any) => {
        agent.agentIcon = this.getIcon(agent.icon);
        return agent;
    }) as any[];

    constructor() {
    }

    goToUserInfo() {
        this.back.next();
    }

    goToAHQOverview() {
        this.next.next();
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

    capitalize(txt: string) {
        return txt.slice(0, 1).toUpperCase() + txt.slice(1);
    }

    downloadAgent(agentLink: string) {
        saveAs(agentLink);
    }
}

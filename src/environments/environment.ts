// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    url: "https://automationhq.ai/",
    api_url: "https://api-test2.automationhq.ai/",
    execution_link:
        "https://s3.us-east-2.amazonaws.com/standalones.automationhq.ai/test/automationhq-standalone-executor-3.0.1.RELEASE.jar",

    agents: [
        {
            id: "windows",
            icon: "windows-logo",
            name: "Download Agent for Windows",
            link: "https://s3.us-east-2.amazonaws.com/standalones.automationhq.ai/ui/test/AHQ+Local+Agent+Setup+1.0.4.exe"
        },
        {
            id: "mac",
            icon: "mac-logo",
            name: "Download Agent for MacOS",
            link: "https://s3.us-east-2.amazonaws.com/standalones.automationhq.ai/ui/test/AHQ+Local+Agent-1.0.4.dmg",
        },
        {
            id: "linux",
            icon: "linux-logo",
            name: "Download Agent for Linux",
            link: "https://s3.us-east-2.amazonaws.com/standalones.automationhq.ai/ui/test/AHQ+Local+Agent-1.0.4.AppImage",
        },
    ],
    privateKey: "Aut0m@t10nhq",
    googleAppId: "889824260896-s6crjbucmhbgc4v9efk3fjvc8pbgj1mb.apps.googleusercontent.com",
    facebookAppId: "684900422527868",
    /*facebookAppId: "447157997153023", => this is for dev*/
    microsoftAppId: "072d381c-cfc8-452d-8164-a7d3a7ae71da",
    recaptchaSiteKey: "6LcBOzAfAAAAAJBotxlPjdvROTuUF6ifewJF4WMr"
};

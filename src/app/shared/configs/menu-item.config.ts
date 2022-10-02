import { Menu } from '@shared/models/menu.model';

// Menu Items
export const MENUITEM: Menu[] = [
    {
        url: '/dashboard',
        title: 'Dashboard',
        type: 'link',
        iconType: 'dashboard',
        enabled: true
    },
    {
        url: '/test-development',
        title: 'Test Development',
        type: 'sub',
        iconType: 'apps',
        collapse: 'test-development',
        children: [
            { url: '/test-scripts', title: 'Test Scripts', ab: '', enabled: true },
            { url: '/test-steps', title: 'Test Steps', ab: '', enabled: true },
            { url: '/object-repository', title: 'Object Repository', ab: '', enabled: true },
        ],
        enabled: true,
    },
    {
        url: '/test-suites',
        title: 'Test Suites',
        type: 'link',
        iconType: 'assignment',
        enabled: true,
    },
    {
        url: '/test-execution',
        title: 'Test Execution',
        type: 'link',
        iconType: 'assignment',
        enabled: true,
    },
    {
        url: '/test-report',
        title: 'Test Reports',
        type: 'link',
        iconType: 'assignment',
        enabled: true,
    },
    {
        url: '/configurations',
        title: 'Configurations',
        type: 'sub',
        iconType: 'apps',
        collapse: 'configurations',
        children: [
            { url: '/environments', title: 'Environments', ab: '', enabled: true },
            { url: '/integration', title: 'Integration', ab: '', enabled: true },
            { url: '/object-repository', title: 'Object Repository', ab: '', enabled: true },
        ],
        enabled: true,
    },
    {
        url: '/admin',
        title: 'Admin',
        type: 'sub',
        iconType: 'apps',
        collapse: 'admin',
        children: [
            { url: '/projects', title: 'Projects', ab: '', enabled: true },
            { url: '/users', title: 'Users', ab: '', enabled: true },
            { url: '/rules', title: 'Rules', ab: '', enabled: true },
        ],
        enabled: true,
    },
    {
        url: '/adons',
        title: 'Adons',
        type: 'link',
        iconType: 'assignment',
        enabled: true,
    },
    {
        url: '/client',
        title: 'Client',
        type: 'link',
        iconType: 'assignment',
        enabled: true,
    },
    {
        url: '/search-api',
        title: 'Search API',
        type: 'link',
        iconType: 'assignment',
        enabled: true,
    },
];

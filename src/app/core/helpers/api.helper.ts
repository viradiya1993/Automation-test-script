import { environment } from "../../../environments/environment";

// Registration Service API
export const REGISTER_API = `${environment.api_url}registration-services/rest/api/registrations/`;

// Auth Service API
export const LOGIN_API = `${environment.api_url}auth-services/`;

// Role Service API
export const ROLE_API = `${environment.api_url}role-services/rest/api/`;

// User Service API
export const USER_API = `${environment.api_url}user-services/rest/api/`;

// User Role Service API
export const USER_ROLE_API = `${environment.api_url}user-role-services/rest/api/`;

// Organization Service API
export const ORGANIZATION_API = `${environment.api_url}organization-services/rest/api/`;

// Project Service API
export const PROJECT_API = `${environment.api_url}project-services/rest/api/`;

// Locator Service API
export const LOCATOR_API = `${environment.api_url}locator-services/rest/api/`;

// Page Service API
export const PAGE_API = `${environment.api_url}page-services/rest/api/`;

// Search Service API
export const TEMPLATE_API = `${environment.api_url}template-services/rest/api/`;

// Test Script Service API
export const Test_Script_API = `${environment.api_url}test-script-services/rest/api/`;

// Test Script Executor Service API
export const Test_Script_Executor_API = `http://127.0.0.1:8087/rest/api/execute/`;

// Test Suite Service API
export const Test_Suite_API = `${environment.api_url}test-suite-services/rest/api/`;

// Test Bot Service API
export const Test_Bot_API = `${environment.api_url}test-bot-services/rest/api/`;

// Test Bot Executor Service API
export const Test_Bot_Executor_API = `${environment.api_url}test-bot-executor-services/rest/api/`;

export const Test_Bot_Executor_API_LOCAL = `http://localhost:8101/rest/api/`;

// Configuration Service API
export const Configuration_API = `${environment.api_url}configuration-services/rest/api/`;

// Global Parameters Service API
export const Global_Parameters_API = `${environment.api_url}global-parameters-services/rest/api/`;

// Browser Service API
export const Browser_API = `${environment.api_url}lookup-browser-services/rest/api/`;

// Grid Service API
export const Grid_API = `${environment.api_url}lookup-grid-services/rest/api/`;

// Environment Service API
export const Environment_API = `${environment.api_url}lookup-environment-services/rest/api/`;

// Dashboard Service API
export const DASHBOARD_API = `${environment.api_url}dashboard-services/rest/api/`;

// Website Service API
export const Website_API = `${environment.api_url}website-services/rest/api/`;

// Epic Service API
export const Epic_API = `${environment.api_url}epic-services/rest/api/`;

// Story Service API
export const Story_API = `${environment.api_url}epic-services/rest/api/`;

// Test Report API
export const TEST_REPORT_API = `${environment.api_url}test-report-services/rest/api/`;

// Release Service API
export const Release_API = `${environment.api_url}release-services/rest/api/`;

export const Scheduler_API = `${environment.api_url}scheduler-services/rest/api/`;

// Payment Service API
export const Payment_Service_API = `${environment.api_url}payment-services/rest/api/`;

// User Script common object
export const User_commonObject_API = `${environment.api_url}common-object-services/rest/api/`;

// Common Function
export const Common_function_API = `${environment.api_url}common-function-services/rest/api/`;

// Common Data Types
export const Common_DataTypes_API = `${environment.api_url}common-datatypes-services/rest/api/`;

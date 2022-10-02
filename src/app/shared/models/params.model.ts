import { FileValuePair } from "./file-value-pair.model";
import { Locator } from "./locator.model";
import { TestScriptValuePair } from "./test-script-value-pair.model";
import { Parameters } from "./user-script.model";
import { TestStep } from '@shared/models/test-step.model';

export interface Params {
    number: ParameterValue;
    xPos: ParameterValue;
    yPos: ParameterValue;
    width: ParameterValue;
    height: ParameterValue;
    text: ParameterValue;
    variable: ParameterValue;
    password?: ParameterValue;
    cookie: ParameterValue;
    expected: ParameterValue;
    test: TestScriptValuePair;
    file: FileValuePair;
    uiLocator: Locator;
    uiTable: Locator;
    commonFunction: CommonFunction;
    paramsValue: ParamsValue;

}

export interface ParameterValue {
    type: ValueType;
    value: string;
}

export enum ValueType {
    Undefined = -1,
    Data = 0,
    Column = 1,
    Configuration = 2,
    Params = 3
}

export interface CommonFunction {
    commonFunctionId: string;
    deleted: boolean;
    name?: string,
    description?: string,
    testSteps?: Array<TestStep>;
    parameters?: Array<Parameters>,
}

export interface ParamsValue {
    paramsValue: string;
    deleted: boolean;
}

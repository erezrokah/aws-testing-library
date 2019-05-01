import { ICommonProps } from './';

export interface IStepFunctionsProps extends ICommonProps {
  stateMachineArn: string;
}

export const expectedProps = ['region', 'stateMachineArn', 'state'];

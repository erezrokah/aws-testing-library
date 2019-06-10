import { ICommonProps } from './';

export interface ICloudwatchProps extends ICommonProps {
  function: string;
  startTime?: number;
}

export const expectedProps = ['region', 'function', 'startTime', 'pattern'];

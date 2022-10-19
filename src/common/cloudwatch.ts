import { ICommonProps } from './';

export interface ICloudwatchProps extends ICommonProps {
  function?: string;
  startTime?: number;
  logGroupName?: string;
}

export interface ToHaveLogOptions {
  isPatternMetricFilterForJSON?: boolean;
}

export const expectedProps = ['region', 'pattern'];

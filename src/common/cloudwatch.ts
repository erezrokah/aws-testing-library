import { ICommonProps } from './';

export interface ICloudwatchProps extends ICommonProps {
  function: string;
}

export const expectedProps = ['region', 'function', 'pattern'];

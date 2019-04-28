import { ICommonProps } from './';

export interface ISqsProps extends ICommonProps {
  queueUrl: string;
}

export const expectedProps = ['region', 'queueUrl', 'matcher'];

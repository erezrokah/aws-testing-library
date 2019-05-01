import { ICommonProps } from './';

export interface IKinesisProps extends ICommonProps {
  stream: string;
}

export const expectedProps = ['region', 'stream', 'matcher'];

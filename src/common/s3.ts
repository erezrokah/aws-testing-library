import { ICommonProps } from './';

export interface IS3Props extends ICommonProps {
  bucket: string;
}

export const expectedProps = ['region', 'bucket', 'key'];

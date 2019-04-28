import { ICommonProps } from './';

export interface IDynamoDbProps extends ICommonProps {
  table: string;
}

export const expectedProps = ['region', 'table', 'key'];

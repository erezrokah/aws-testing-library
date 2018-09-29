export interface ICommon {
  region: string;
}

export const verifyProps = (props: any, expectedProps: string[]) => {
  for (const prop of expectedProps) {
    const value = props[prop];
    if (!value) {
      throw new Error(`Missing ${prop} from received props`);
    }
  }
};

export default interface IPermission {
  _id: string;
  tag: string;
  code: string;
  path: string;
  action: string;
  params: Array<string>;
  isActivated: boolean;
}

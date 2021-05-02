export default class DataSet {
  public label: string;
  public data: Array<number>;
  public fill: boolean;
  public borderColor: string;
  public hidden: boolean;

  public constructor(
    label: string,
    fill: boolean,
    borderColor: string,
    hidden: boolean
  ) {
    this.label = label;
    this.data = [];
    this.fill = fill;
    this.borderColor = borderColor;
    this.hidden = hidden;
  }
}

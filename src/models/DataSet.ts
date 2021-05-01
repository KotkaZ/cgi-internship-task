export default class DataSet {
  public label: string;
  public data: Array<number>;
  public fill: boolean;
  public borderColor: string;

  public constructor(label: string, fill: boolean, borderColor: string) {
    this.label = label;
    this.data = [];
    this.fill = fill;
    this.borderColor = borderColor;
  }
}

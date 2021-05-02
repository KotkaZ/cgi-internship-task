export default class Timezone {
  public name: string;
  public offset: number;

  public constructor(name: string, offset: number) {
    this.name = name;
    this.offset = offset;
  }
}

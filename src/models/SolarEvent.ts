/**
 * This SolarEvent module is based General Solar Position Calculations by NOAA Global Monitoring Division
 * https://www.esrl.noaa.gov/gmd/grad/solcalc/solareqns.PDF
 * The module uses strong estimations, therefore it may not be used for precise readings/calculations.
 *
 * Author: Karl Rapur
 */
export default class SolarEvent {
  private latitude: number;
  private longitude: number;
  private date: Date;
  private DOY: number;
  private daylight: number;
  private sunset: number;
  private sunrise: number;

  public constructor(latitude: number, longitude: number, date: Date) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.date = date;
    this.DOY = this.daysPassed();
    this.sunrise = this.sunEvent(true);
    this.sunset = this.sunEvent(false);
    this.daylight = this.calculateDaylight();
  }

  /**
   * Calculates time difference in between selected date and beginning of year.
   * @returns Number of days passed this year since January the 1st.
   */
  private daysPassed(): number {
    const current = new Date(this.date.getTime());
    const previous = new Date(this.date.getFullYear(), 0, 1);

    return Math.ceil((current.valueOf() - previous.valueOf() + 1) / 86400000);
  }

  /**
   *
   * @returns the fractional year (γ) in radians.
   */
  private fractionalYear(): number {
    const year = this.date.getUTCFullYear();
    const isLeapYear = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
    const hour = this.date.getUTCHours();

    return (
      ((2 * Math.PI) / (isLeapYear ? 366 : 365)) *
      (this.DOY - 1 + (hour - 12) / 24)
    );
  }

  /**
   *
   * @returns the equation of time (in minutes).
   */
  private equationTime(): number {
    const γ = this.fractionalYear();

    return (
      229.18 *
      (0.000075 +
        0.001868 * Math.cos(γ) -
        0.032077 * Math.sin(γ) -
        0.014615 * Math.cos(2 * γ) -
        0.040849 * Math.sin(2 * γ))
    );
  }

  /**
   *
   * @returns the solar declination angle (in radians).
   */
  private declinationAngle(): number {
    const γ = this.fractionalYear();
    return (
      0.006918 -
      0.399912 * Math.cos(γ) +
      0.070257 * Math.sin(γ) -
      0.006758 * Math.cos(2 * γ) +
      0.000907 * Math.sin(2 * γ) -
      0.002697 * Math.cos(3 * γ) +
      0.00148 * Math.sin(3 * γ)
    );
  }

  /**
   *
   * @returns the hour angle (in radians).
   */
  private solarHourAngle(): number {
    const lat = this.latitude;
    const decl = this.declinationAngle();

    return Math.acos(
      Math.cos((90.833 * Math.PI) / 180) /
        (Math.cos((lat * Math.PI) / 180) * Math.cos(decl)) -
        Math.tan((lat * Math.PI) / 180) * Math.tan(decl)
    );
  }

  /**
   *
   * @param rising If true, then sunrise is calculated. If false, then sunset is calculated.
   * @returns the UTC time of sunrise (or sunset) in hours
   */
  private sunEvent(rising: boolean): number {
    const ha = this.solarHourAngle() * (180 / Math.PI);
    const long = this.longitude;
    const eqtime = this.equationTime();
    return (
      (rising
        ? 720 - 4 * (long + ha) - eqtime
        : 720 - 4 * (long - ha) - eqtime) / 60
    );
  }

  private calculateDaylight(): number {
    return this.sunset - this.sunrise;
  }

  public get getDaylight(): number {
    return this.daylight;
  }

  public get getSunrise(): number {
    return this.sunrise;
  }

  public get getSunset(): number {
    return this.sunset;
  }

  public get getDate(): Date {
    return this.date;
  }
}

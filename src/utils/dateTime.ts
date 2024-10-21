import { add0toNumber } from "./add0toNumber";

export class DateTime {
  static CalendarDate = (val: any) => {
    const date = new Date(val);

    return `${date.getFullYear()} - ${date.getMonth() + 1} - ${add0toNumber(date.getDate())}`
  }
}
export default abstract class Util {
  public static map(val: number, min1: number, max1: number, min2: number, max2: number): number {
    return min2 + ((max2 - min2) / (max1 - min1)) * (val - min1);
  }
}

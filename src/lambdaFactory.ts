import {IFunction, IConsumer, IPredicate, ISupplier} from "./optional"

export default class LambdaFactory {
  private constructor() {
  }

  public static getFunction<T, R>(fn: (var1: T) => R): IFunction<T, R> {
    return {
      apply: fn
    }
  }

  public static getConsumer<T>(fn: (var1: T) => void): IConsumer<T> {
    return {
      accept: fn
    }
  }

  public static getPredicate<T>(fn: (var1: T) => boolean): IPredicate<T> {
    return {
      test: fn,
    }
  }

  public static getSupplier<T>(fn: () => T): ISupplier<T> {
    return {
      get: fn
    }
  }
}
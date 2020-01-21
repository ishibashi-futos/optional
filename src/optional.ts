import LambdaFactory from "./lambdaFactory"

export default class Optional<T> {

  private static readonly EMPTY: Optional<any> = new Optional()
  private readonly value: T | null

  private constructor(var1?: T | null) {
    if (typeof var1 !== "undefined") {
      this.value = Objects.requireNonNull<T>(var1)
    } else {
      this.value = null
    }
  }

  public static empty<T>(): Optional<T> {
    const var0: Optional<T> = this.EMPTY
    return var0
  }

  public static of<T>(var0: T | null): Optional<T> {
    return new Optional<T>(var0)
  }

  public static ofNullable<T>(var0: T | null): Optional<T> {
    return var0 == null ? this.empty() : this.of(var0)
  }

  public get(): T {
    if (this.value !== null) {
      return this.value 
    } else {
      throw new NoSuchElementException()
    }
  }

  public isPresent(): boolean {
    return this.value != null
  }

  public ifPresent(var1: IConsumer<T>): void {
    if (this.value !== null) {
      var1.accept(this.value)
    }
  }

  public filter(var1: IPredicate<T>): Optional<T> {
    Objects.requireNonNull(var1)
    if (!this.isPresent()) {
      return this
    } else {
      return var1.test(this.value as T) ? this : Optional.empty<T>()
    }
  }

  public map<T, U>(var0: IFunction<T, U>): Optional<U> {
    Objects.requireNonNull(var0)
    return !this.isPresent() ? Optional.empty<U>() : Optional.ofNullable<U>(var0.apply(this.value as any))
  }

  public orElse(var1: T): T {
    return this.value !== null ? this.value : var1
  }

  public orElseGet(var1: ISupplier<T>): T {
    return this.value !== null ? this.value : var1.get()
  }

  public orElseThrow<X extends Throwable>(var1: ISupplier<X>): T {
    if (this.value !== null) {
      return this.value
    } else {
      throw <Throwable>var1.get();
    }
  }

  public equals(var1: Object): boolean {
    if (this === var1) {
      return true
    } else if (!(var1 instanceof Optional)){
      return false
    } else {
      const var2: Optional<T> = <Optional<T>>var1
      return Objects.equals(this.value, var2.value)
    }
  }

  public hashCode(): number {
    return Objects.hashCode(this.value);
  }

  public toString(): string {
    const format = function (var0: string, ...var1: Object[]): string {
      let formattedString = var0
      var1.forEach((v, i) => {
        formattedString = formattedString.replace(`[%s]`, v.toString())
      });
      return formattedString
    }
    return this.value !== null ? format("Optional[%s]", this.value) : "Optional.empty"
  }
}

class Objects {
  private constructor() {
  }

  public static requireNonNull<T>(var0: T | null): T {
    if (var0 == null) {
      throw new NullPointerException()
    } else {
      return var0
    }
  }

  public static equals(var0: any, var1: any): boolean {
    const equals = function (): boolean {
      return var0 == var1
    }
    return var0 == var1 || var0 != null && equals();
  }

  public static hashCode(var0: Object | null): number {
    const hashCode = function (): number {
      return Math.random() * 10000
    }
    return var0 != null ? hashCode() : 0
  }
}

class NullPointerException extends Error {
  constructor(message?: string | undefined) {
    super(message)
  }
}

class NoSuchElementException extends Error {
  constructor(message?: string | undefined) {
    super(message)
  }
}

interface IConsumer<T> {
  accept(var1: T): void
}

interface IPredicate<T> {
  test(var1: T): boolean
}

interface IFunction<T, R> {
  apply(var1: T): R
}

interface ISupplier<T> {
  get(): T
}

class Throwable {
  constructor(var1?: String | Throwable, var2?: Throwable, var3?: boolean, var4?: boolean) {
  }
}

export {
  IFunction,
  IConsumer,
  IPredicate,
  ISupplier,
}
/** ここから使い方 */

const getHoge = function(): string | null {
  return "hogehoge"
}
const hogeOpt: Optional<string> = Optional.ofNullable<string>(getHoge())
hogeOpt.ifPresent({
  accept: () => {

  }
});

const hogeLength: Optional<number> = hogeOpt.map<string, number>({
  apply: function (var1: string) {
    return var1.length
  }
});
console.log(hogeLength, hogeLength.get())

const filterdOpt = hogeOpt.filter({
  test: function(var1: string): boolean {
    return var1.length > 0
  }
})

console.log(filterdOpt, filterdOpt.get())

const hogeA = Optional.ofNullable("hogehoge")
const hogeB = Optional.ofNullable("hogehoge")
console.log(hogeA, hogeB, hogeA.equals(hogeB))
console.log(hogeA, hogeA.equals(Optional.ofNullable("hogefuge")))
const hoge = Optional.ofNullable<string>(null)
console.log(hoge.orElse("orElse"));
console.log(hoge.orElseGet({
  get: function () {
    return "orElseGet"
  }
}));

try {
  const opt1 = Optional.of<string>("opt1")
  console.log(opt1.get())
  const opt2 = Optional.of<string>(null)
  console.log(opt2)
} catch (e) {
  console.log(e)
}

/** Factoryクラスを使うパターン */
{
  let getHoge = function () {
    return "hogehoge"
  }
  const opt1 = Optional.ofNullable<string>(getHoge())
  console.log(opt1.get())
  opt1.ifPresent(LambdaFactory.getConsumer<string>((var1) => {
    console.log("ifPresent", var1)
  }));

  const hogeLength = opt1.map<string, number>(LambdaFactory.getFunction<string, number>((var1: string) => {
    return var1.length * Math.random()
  }));
  console.log(hogeLength.get())
  
}

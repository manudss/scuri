/**
 * Keeps the types of properties of a type but assigns type of jest.Mock to the methods.
 * That way the methods can be mocked and examined for calls.
 *
 * @example
 *
 * class Service {
    *  property: string;
    *  method(): string {
    *    return 'test'
    *  };
    * }
    *
    * it('should carry the types (only methods should be mocked)', () => {
    *  // arrange
    *  const ser = autoSpy(Service);
    *  // this line would show a typescript error were it not for the type- can't assign string to jest.Mock type
    *  ser.property = 'for the test';
    *  ser.method.mockReturnValue('test');
    *
    *  // act
    *  const res = ser.method();
    *
    *  // assert
    *  expect(ser.method).toHaveBeenCalled();
    *  expect(res).toBe('test');
    * })
    *
    */
   type SpyOf<T> = {
       [k in keyof T]: T[k] extends (...args: any[]) => infer R ? T[k] & jest.Mock<R> : T[k]
   };

   /** Create an object with methods that are autoSpy-ed to use as mock dependency */
   export function autoSpy<T>(obj: new (...args: any[]) => T): SpyOf<T> {
       const res: SpyOf<T> = {} as any;

       Object.keys(obj.prototype).forEach(key => {
           res[key] = jest.fn();
       });

       return res;
   }
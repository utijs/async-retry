export interface Options {
  /** Number of retries */
  retries: number;
  /** Optional property, return false to cancel retry operation */
  retryOn?: (attempt: number, error?: any, response?: any) => boolean;
}

type AsyncOperation = (params: any) => Promise<any>;

/**
 * Retry async operation
 *
 * @param {AsyncOperation} operation
 * @param {Options} options
 */
export function retry(operation: AsyncOperation, options: Options) {
  return function retryOperation(...args: any) {
    const { retries, retryOn } = options;
    // TODO: options validations

    return new Promise(function(resolve, reject) {
      var wrappedOperation = function(attempt: number) {
        operation(args)
          .then(resolve)
          .catch(function(error) {
            if (typeof retryOn === 'function') {
              if (retryOn(attempt + 1, error, null)) {
                run(attempt);
              } else {
                reject(error);
              }
            } else if (attempt < retries) {
              run(attempt);
            } else {
              reject(error);
            }
          });
      };

      function run(attempt: number) {
        wrappedOperation(++attempt);
      }

      wrappedOperation(0);
    });
  };
}

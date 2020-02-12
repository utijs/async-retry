import { retry } from '../src';

describe('retry', () => {
  it('should retry', async () => {
    let calls = 0;
    
    const fn = async () => {
      calls += 1;
      throw new Error('Cancel');
    }

    const retryOperation = retry(fn, { retries: 2 });

    try {
      await retryOperation();
    } catch (error) {
      expect(error.message).toMatch('Cancel');
      expect(calls).toEqual(3);
    }
  });
});

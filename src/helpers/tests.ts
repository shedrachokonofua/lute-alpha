export const buildStub = <T>(overrides: Partial<T>): T => {
  const stub = {} as T;
  Object.entries(overrides).forEach(([key, value]) => {
    stub[key as keyof T] = value as T[keyof T];
  });
  return stub;
};

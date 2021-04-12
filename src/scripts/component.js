export const Component = (name = 'unknown') => {
  return {
    get name() {
      return name;
    },
  };
};

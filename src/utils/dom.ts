export const moveToTop = (): void => {
  window.scrollTo({ top: 0 });
};

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

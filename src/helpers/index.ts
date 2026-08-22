export const classToPlainObject = (theClass) => {
  const originalClass = theClass || {};
  const keys = Object.keys(theClass);
  return keys.reduce((classAsObj, key) => {
    classAsObj[key] = originalClass[key];
    return classAsObj;
  }, {});
};

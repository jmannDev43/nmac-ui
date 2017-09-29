function isMaxYear(collisionYears, currentYear) {
  const maxYear = Math.max.apply(null, collisionYears);
  return currentYear === maxYear;
}

export default isMaxYear;

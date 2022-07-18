const isNumber = (value) => typeof value === "number" && Number.isFinite(value);

module.exports = {
  isNumber,
};

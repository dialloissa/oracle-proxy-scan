// This is a pretty basic check that input conforms to e164. Unlikely it could be much better.
// eslint-disable-next-line yoda
module.exports = (num) => null != num.match(/^\+?[1-9]\d{1,14}$/);

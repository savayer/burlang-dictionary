/**
 * This function splits an array of objects into sets, groups by the property value as key and the sets as value.
 *
 * @param {array} array - array of objects
 * @param {string} property - property/key
 *
 * @return {object} - this object will contain grouped sets of the given array
 *
 * @example:
 *    const array = [
 *      { id: 1, type: 'train', ... },
 *      { id: 2, type: 'bus', ... },
 *      { id: 3, type: 'train', ... }];
 *    groupBy(array, "type");
 *
 *    returns {
 *      train: [{ id: 1, type: 'train', ... }, { id: 3, type: 'train', ... }],
 *      bus: [{ id: 2, type: 'bus', ... }]
 *    }
 */
export default function groupBy(array, property) {
  return array.reduce((memo, x) => {
    if (!memo[x[property]]) {
      memo[x[property]] = [];
    }
    memo[x[property]].push(x);

    return memo;
  }, {});
}

import _ from 'lodash';

// eslint-disable-next-line @typescript-eslint/ban-types
export default function debounce(cb: Function) {
  return _.debounce(cb, 700);
}

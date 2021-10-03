import { helper } from '@ember/component/helper';

export default helper(function wordsIn([sentence]) {
  if (!sentence) return 0;

  return sentence.split(/\s+/).length;
});

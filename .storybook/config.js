import { configure } from '@kadira/storybook';

function loadStories() {
  require('../src/stories/basic-example');
  require('../src/stories/full-example');
  require('../src/stories/my-example');
}

configure(loadStories, module);

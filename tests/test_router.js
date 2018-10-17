import tap from 'tap';
import 'react';
import { RouterThunk } from '../src/router';

const component1 = () => { };
const component2 = () => { };
const component3 = () => { };

const routes = {
  routes: [
    { component: component1, exact: true },
    { component: component2, exact: true, path: '/hello' },
  ],
  hello: {
    world: {
      routes: [{ component: component3, exact: true }],
    },
  },
};

tap.test('test_router', (t) => {
  const router = RouterThunk(routes)();
  const { children } = router.props;
  t.strictEquals(children.length, 3, 'should have 3 routes');
  t.strictEquals(children[0].props.path, '/', 'should have /');
  t.strictEquals(children[1].props.path, '/hello', 'should have /hello');
  t.strictEquals(children[2].props.path, '/hello/world', 'should have /hello/world');
  t.end();
});

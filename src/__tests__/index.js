// @flow
/* eslint-env browser */
import tape from 'tape-cup';
import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { createPlugin } from 'fusion-core';
import App from 'fusion-react';
import {getSimulator} from 'fusion-test-utils';
import Redux, {
  ReduxToken,
  EnhancerToken,
  ReducerToken,
} from 'fusion-plugin-react-redux';
import Plugin, {EpicToken} from '../index.js';
import {ofType} from 'redux-observable';
import {mapTo} from 'rxjs/operators';

Enzyme.configure({adapter: new Adapter()});

/* Test fixtures */
const epic = action$ => action$.pipe(ofType('DO_TEST'), mapTo({type: 'GOOD_ACTION'}));
const appCreator = Component => {
  const app = new App(<Component />, el => el);
  app.register(ReduxToken, Redux);
  app.register(ReducerToken, (state = {count: 0, test: false}, action) => {
    switch (action.type) {
      case 'GOOD_ACTION': {
        return {
          ...state,
          test: true,
          count: state.count + 1,
        };
      }
      default: {
        return state;
      }
    }
  });
  app.register(EpicToken, epic);
  app.register(EnhancerToken, Plugin);
  return app;
};

tape('store enhancer', async t => {
  t.plan(4);
  const Root = () => <div />;
  const app = appCreator(Root);
  app.register(
    createPlugin({
      deps: {redux: ReduxToken},
      middleware: ({redux}) => async (ctx, next) => {
        await next();
        const store = redux.from(ctx).store;
        t.equal(store.getState().test, false, 'reducer is correct');
        t.equal(store.getState().count, 0, 'reducer is correct');
        store.dispatch({type: 'DO_TEST'});
        t.equal(store.getState().test, true, 'reducer is correct');
        t.equal(store.getState().count, 1, 'reducer is correct');
      },
    })
  );
  const sim = getSimulator(app);
  await sim.render('/');
  t.end();
});

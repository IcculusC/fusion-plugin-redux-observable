// @flow
import {
  createPlugin,
  createToken,
  type FusionPlugin,
  type Token,
} from 'fusion-core';
import {compose, type StoreEnhancer} from 'redux';
import {createEpicMiddleware, type Epic} from 'redux-observable';
import {type EpicEnhancerServiceType} from './types';

export const EpicToken: Token<Epic> = createToken('EpicToken');
export const EpicEnhancerToken: Token<StoreEnhancer<*, *, *>> = createToken(
  'EpicEnhancerToken'
);

const plugin = createPlugin({
  deps: {epic: EpicToken},
  provides({epic}): StoreEnhancer<*, *, *> {
    return createStore => (...args) => {
      const store = createStore(...args);
      const epicMiddleware = createEpicMiddleware();
      const {getState, dispatch} = store;
      const dispatch_ = compose(epicMiddleware({getState, dispatch}))(dispatch);
      epicMiddleware.run(epic);

      return {
        ...store,
        dispatch: dispatch_,
      };
    };
  },
});
export default ((plugin: any): FusionPlugin<empty, EpicEnhancerServiceType>);

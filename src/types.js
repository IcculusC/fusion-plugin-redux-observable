// @flow
import {type StoreEnhancer} from 'redux';

export type EpicEnhancerServiceType = {
  createStore: StoreEnhancer<*, *, *>,
};

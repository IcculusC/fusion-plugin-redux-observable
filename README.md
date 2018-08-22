# fusion-plugin-redux-observable

---

### Table of contents

* [Usage](#usage)
* [Setup](#setup)
* [API](#api)
    * [Registration API](#registration-api)
    * [Dependencies](#dependencies)

---

### Usage

```js
// epic.js
// plain ol' epic
import { ofType } from 'redux-observable';
import { delay, mapTo } from 'rxjs/operators';
import { PING, pong } from './actions';

export default action$ =>
  action$.pipe(
    ofType(PING),
    delay(1000),
    mapTo(pong()),
  );
```

### Setup

```js
// main.js
import React from 'react';
import Redux, {
  ReduxToken,
  ReducerToken,
  EnhancerToken,
  GetInitialStateToken,
} from 'fusion-plugin-react-redux';
import EpicEnhancer, { EpicToken, EpicEnhancerToken } from 'fusion-plugin-redux-observable';
import App from 'fusion-react';
import { createPlugin } from 'fusion-core';
import { compose } from 'redux';
import reducer from './reducer';
import epic from './epic';

export default () => {
  const app = new App(root);
  app.register(ReduxToken, Redux);
  app.register(ReducerToken, reducer);
  app.register(EpicToken, epic);
  app.register(EpicEnhancerToken, EpicEnhancer);
  app.register(EnhancerToken, createPlugin({
    deps: { epicEnhancer: EpicEnhancerToken },
    provides: ({ epicEnhancer }) => compose(epicEnhancer),
  }));
  __NODE__ && app.register(GetInitialStateToken, async ctx => ({}));
}
```

### API

#### Registration API

##### `EpicEnhancer`
```js
import EpicEnhancer from 'fusion-plugin-redux-observable';
```

The `redux-observable` enhancer.  Installs middleware and runs required epic registered to [`EpicToken`](#epictoken).  Typically registed to [`EpicEnhancerToken`](#epicenhancertoken)

##### `EpicEnhancerToken`
```js
import { EpicEnhancerToken } from 'fusion-plugin-redux-observable';
```

Typically registered with [`EpicEnhancer`](#epicenhancer)

#### Dependencies

##### `EpicToken`
```js
import { EpicToken } from 'fusion-plugin-redux-observable';
```

The root [epic](https://redux-observable.js.org/docs/basics/Epics.html). Required.

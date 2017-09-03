// @flow

import React from "react";

export default function Magic() {
  return (
    <div>
      <h1>A deferred component, continued...</h1>
      <p>
        The second trick builds on the first and since we have a static route
        configuration we can unwrap all the AsyncComponents before first use.
        Neither the client nor server will actually hit the AsyncComponent
        initially. To the outside, it would appear as if these components where
        just normal components.
      </p>
    </div>
  );
}

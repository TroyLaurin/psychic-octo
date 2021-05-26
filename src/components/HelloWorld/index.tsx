import React, { ReactElement } from "react";

const HelloWorld: React.FC = (): ReactElement => (
  <>
    <h1>Yo yo yo</h1>

    <hr />

    <h3>Environment variables:</h3>
    <p>
      process.env.PRODUCTION: <b>{process.env.PRODUCTION}</b>
    </p>
    <p>
      process.env.NAME: <b>{process.env.NAME}</b>
    </p>
    <p>
      process.env.VERSION: <b>{process.env.VERSION}</b>
    </p>
  </>
);

export default HelloWorld;

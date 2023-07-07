import React from 'react';
import { Paragraph } from '@contentful/f36-components';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';

const Home = () => {
  const sdk = useSDK();
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();

  // return <Paragraph>Hello Home Component (AppId: {sdk.ids.app})</Paragraph>;
  return (
    <>
    <Paragraph>Hello from Rashmi</Paragraph>
    <form id="upload-form">
      <input type="file" id="media-input" accept="image/*" />
      <button type="submit">Upload</button>
    </form>

    <div id="result"></div>
    <Paragraph>Hello Home Component (AppId: {sdk.ids.app})</Paragraph>
    </>
  )
};

export default Home;

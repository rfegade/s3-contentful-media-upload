// import React, { useState } from 'react';
// import { /* Paragraph */ } from '@contentful/f36-components';
// import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';


// const contentful = require("contentful");
// const AWS = require("aws-sdk");

// const Field = () => {
//   // Remove unused imports (Paragraph, useCMA)

//   // const sdk = useSDK();
//   // You can uncomment the above line if you need to use the `sdk` object.

//   // State for storing file and result message
//   const [file, setFile] = useState(null);
//   const [resultMessage, setResultMessage] = useState('');


//   // const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
//   // const spaceId = process.env.CONTENTFUL_SPACE_ID;
//   console.log('contetful accesskey', process.env.CONTENTFUL_ACCESS_TOKEN );
//   console.log('spaceId', process.env.CONTENTFUL_SPACE_ID );
//   const accessToken = 'jcT7Nl4hLQLBURRGMkne3-hATwdEfbgHG5ZrnGpZEC0';
//   const spaceId = 'l24s8dg78n6r';

//   const contentTypeId = 'recipe';
//   // const s3BucketName = process.env.S3_BUCKET_NAME;

//   // Configure AWS SDK
//   console.log('accessKeyId', process.env.REACT_APP_AWS_ACCESS_ID);
//   console.log('secretkey', process.env.REACT_APP_AWS_SECRET_ACCESS_KEY);
//   AWS.config.update({
//     // accessKeyId: process.env.AWS_ACCESS_ID,
//     // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     // region: process.env.AWS_REGION,
//     accessKeyId: 'AKIAV66ELWP3WU7XANCE',
//     secretAccessKey: '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',
//     region: 'us-east-1',

//   });

//   // Event handler for file input change
//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   // Event handler for form submission
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!file) {
//       setResultMessage('File not found');
//       return;
//     }

//     try {
//       // Perform file upload and entry creation
//       const s3FileUrl = await uploadToS3(file);
//       const entryId = await createContentfulEntry(s3FileUrl);

//       setResultMessage(`Uploaded successfully. Entry ID: ${entryId}`);
//     } catch (error) {
//       setResultMessage(`Upload failed: ${error.message}`);
//     }
//   };

// // Create an instance of S3
// const s3 = new AWS.S3();

// async function uploadToS3(file) {
//   const params = {
//     Bucket: "brk-survey",
//     Key: `${Date.now().toString()}-${file.name}`,
//     Body: file,
//     ACL: "public-read",
//     ContentType: file.type,
//   };

//   const { Location } = await s3.upload(params).promise();
//   return Location;
// }

//   async function createContentfulEntry(fileUrl) {
//     // Contentful client code for creating an entry
//     const client = contentful.createClient({
//       accessToken,
//     });
  
//     const space = await client.getSpace(spaceId);
//     const contentType = await space.getContentType(contentTypeId);
//     const entry = await contentType.createEntryWithId("media", {
//       fields: {
//         fileUrl: {
//           "en-US": fileUrl,
//         },
//       },
//     });
  
//     return entry.sys.id;
//   }

//   return (
//     <>
//       <form onSubmit={handleSubmit}>
//         <input type="file" onChange={handleFileChange} accept="image/*" />
//         <button type="submit">Upload</button>
//       </form>

//       <div>{resultMessage}</div>
//     </>
//   );
// };

// export default Field;





import React, { useState, useEffect } from 'react';
import { /* Paragraph */ } from '@contentful/f36-components';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';

const AWS = require('aws-sdk');

const Field = () => {
  // State for storing file and result message
  const [file, setFile] = useState(null);
  const [resultMessage, setResultMessage] = useState('');

  useEffect(() => {
    // Configure AWS SDK
    AWS.config.update({
      accessKeyId: 'AKIAV66ELWP3WU7XANCE',
      secretAccessKey: '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',
      region: 'us-east-1',
    });

    // Set CORS configuration for the S3 bucket
    const s3 = new AWS.S3();
    const corsParams = {
      Bucket: 'brk-survey', // Replace with your S3 bucket name
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: ['*'], // Update with the desired origin or origins
            AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE'],
            AllowedHeaders: ['*'],
          },
        ],
      },
    };

    s3.putBucketCors(corsParams, (err) => {
      if (err) {
        console.error('Failed to set CORS configuration:', err);
      } else {
        console.log('CORS configuration set successfully');
      }
    });
  }, []);

  // Event handler for file input change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Event handler for form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setResultMessage('File not found');
      return;
    }

    try {
      // Perform file upload and entry creation
      const s3FileUrl = await uploadToS3(file);
      const entryId = await createContentfulEntry(s3FileUrl);

      setResultMessage(`Uploaded successfully. Entry ID: ${entryId}`);
    } catch (error) {
      setResultMessage(`Upload failed: ${error.message}`);
    }
  };

  async function uploadToS3(file) {
    const s3 = new AWS.S3();

    const params = {
      Bucket: 'brk-survey', // Replace with your S3 bucket name
      Key: `${Date.now().toString()}-${file.name}`,
      Body: file,
      ACL: 'public-read',
      ContentType: file.type,
    };

    const { Location } = await s3.upload(params).promise();
    return Location;
  }

  async function createContentfulEntry(fileUrl) {
    // Contentful client code for creating an entry
    const accessToken = 'jcT7Nl4hLQLBURRGMkne3-hATwdEfbgHG5ZrnGpZEC0';
    const spaceId = 'l24s8dg78n6r';
    const contentTypeId = 'recipe';

    const contentful = require('contentful');
    const client = contentful.createClient({
      accessToken,
    });

    const space = await client.getSpace(spaceId);
    const contentType = await space.getContentType(contentTypeId);
    const entry = await contentType.createEntryWithId('media', {
      fields: {
        fileUrl: {
          'en-US': fileUrl,
        },
      },
    });

    return entry.sys.id;
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit">Upload</button>
      </form>

      <div>{resultMessage}</div>
    </>
  );
};

export default Field;



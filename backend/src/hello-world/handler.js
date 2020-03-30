'use strict';

module.exports.hello = async event => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Orign': '*'
    },
    body:
    {
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }
  };

};

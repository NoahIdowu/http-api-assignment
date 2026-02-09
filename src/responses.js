const respond = (request, response, status, object, type) => {
  response.writeHead(status, { 'Content-Type': type });

  if (type === 'text/xml') {
    let responseXML = '<response>';
    responseXML += `<message>${object.message}</message>`;
    if (object.id) responseXML += `<id>${object.id}</id>`;
    responseXML += '</response>';
    return response.end(responseXML);
  }

  response.end(JSON.stringify(object));
};

const success = (request, response, mediaType) => {
  const responseObj = { message: 'This is a successful response.' };
  const type = mediaType.includes('text/xml') ? 'text/xml' : 'application/json';
  respond(request, response, 200, responseObj, type);
};

const badRequest = (request, response, mediaType, params) => {
  const types = mediaType || ['application/json'];
  const queryParams = params || {};

  // Response if query parameters a present
  const responseObj = { message: 'This request has the required parameters.' };

  // Response if query parameters are not present
  if (!queryParams.valid || queryParams.valid !== 'true') {
    responseObj.message = 'Missing valid query parameter set to true.';
    responseObj.id = 'badRequest';
    const type = types.includes('text/xml') ? 'text/xml' : 'application/json';
    return respond(request, response, 400, responseObj, type);
  }

  const type = types.includes('text/xml') ? 'text/xml' : 'application/json';
  respond(request, response, 200, responseObj, type);
};

const unauthorized = (request, response, mediaType, params) => {
  const types = mediaType || ['application/json'];
  const queryParams = params || {};

  // Default response for a successful login
  const responseObj = {
    message: 'You have successfully viewed the content.'
  };

  // Response for an unsuccessful login
  if (!queryParams.loggedIn || queryParams.loggedIn !== 'yes') {
    responseObj.message = 'Missing loggedIn query parameter set to yes';
    responseObj.id = 'unauthorized';


    const type = types.includes('text/xml') ? 'text/xml' : 'application/json';


    return respond(request, response, 401, responseObj, type);
  }

  const type = types.includes('text/xml') ? 'text/xml' : 'application/json';
  respond(request, response, 200, responseObj, type);
};

const forbidden = (request, response, types) => {
  respond(request, response, 403,
    { message: 'You do not have access to this content.', id: 'forbidden' },
    types.includes('text/xml') ? 'text/xml' : 'application/json');
};

const internal = (request, response, types) => {
  respond(request, response, 500,
    { message: 'Internal Server Error. Something went wrong.', id: 'internalError' }, 
    types.includes('text/xml') ? 'text/xml' : 'application/json');
};

const notImplemented = (request, response, types) => {
  respond(request, response, 501,
    { message: 'A get request for this page has not been implemented yet. Check again later for updated content.', id: 'notImplemented' }, 
    types.includes('text/xml') ? 'text/xml' : 'application/json');
};

const notFound = (request, response, types) => 
  {respond(request, response, 404, 
    { message: 'The page you are looking for was not found.', id: 'notFound' }, 
    types.includes('text/xml') ? 'text/xml' : 'application/json');}

module.exports = { 
  success, 
  badRequest, 
  unauthorized, 
  forbidden, 
  internal, 
  notImplemented, 
  notFound };
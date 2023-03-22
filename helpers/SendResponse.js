const HttpResponse = require("../contants/HttpResponse");

const sendResponse = (
  res,
  message = "",
  data = {},
  pagination,
  statusCode = HttpResponse.HTTP_OK
) => {
  const response = {
    success: statusCode === HttpResponse.HTTP_OK,
    message,
    data,
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};

module.exports = sendResponse;

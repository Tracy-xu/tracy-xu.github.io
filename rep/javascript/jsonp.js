function jsonToQueryString(requestData) {
  var queryString = '';

  if (typeof requestData === 'object') {
    for (var key in requestData) {
      queryString += '&' + key + '=' + requestData[key];
    }
  }

  return queryString;
}

function getJSONP(url, requestData, callback) {
  if (!url) {
    return;
  }

  // 函数体
  var callbackName = 'JSONP_' + Math.random().toString().substr(2);

  window[callbackName] = function (responseData) {
    try {
      callback && callback(responseData);
    } catch (e) {
    } finally {
      delete window[callbackName];
      scriptElement.parentNode.removeChild(scriptElement);
    }
  };

  // 函数执行
  var scriptElement = document.createElement('script');
  url += (url.indexOf('?') === -1 ? '?' : '&') + 'callback=' + callbackName + jsonToQueryString(requestData);
  scriptElement.src = url;
  document.querySelector('head').appendChild(scriptElement);
}

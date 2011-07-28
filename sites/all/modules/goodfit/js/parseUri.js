function parseUri(url) {
  var request = {};
  var pairs = url.substring(url.indexOf('?') + 1).split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return request;
}

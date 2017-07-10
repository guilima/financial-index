function getValuesSeriesService() {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://fintech-bcb.herokuapp.com/users/');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.withCredentials = false;

    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr);
    xhr.send();
  });
}

function postValuesSeriesService(body) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://fintech-bcb.herokuapp.com/users/');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.withCredentials = false;

    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr);
    body = JSON.stringify(body);
    xhr.send(body);
  });
}

export default { getValuesSeriesService, postValuesSeriesService };

function getValuesSeriesService(dateInitial = '', dateEnd = '', series = '') {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', `https://fintech-backend.herokuapp.com/series?dateInitial=${dateInitial}&dateEnd=${dateEnd}&idGroup=${series}`);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.withCredentials = false;

    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr);
    xhr.send();
  });
}

export default { getValuesSeriesService };

function getValuesSeriesService(dateInitial = '', dateEnd = '', series = '') {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', `${process.env.VUE_APP_API}/series?dateInitial=${dateInitial}&dateEnd=${dateEnd}&idGroup=${series}`);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.withCredentials = false;

    xhr.onload = () => resolve(JSON.parse(xhr.responseText));
    xhr.onerror = () => reject(xhr);
    xhr.send();
  });
}

export default { getValuesSeriesService };

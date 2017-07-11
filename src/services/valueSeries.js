function getValuesSeriesService(dateI = '', dateE = '') {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    console.log(dateI, dateE);
    var dateInitial = dateI;
    var dateEnd = dateE;
    xhr.open('GET', `https://fintech-bcb.herokuapp.com/users?dateInitial=${dateInitial}&dateEnd=${dateEnd}`);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.withCredentials = false;

    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr);
    xhr.send();
  });
}

export default { getValuesSeriesService };

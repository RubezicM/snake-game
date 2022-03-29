const LS = {
  init: function (dataName) {
    let choosenEntry = localStorage.getItem(dataName)
    if (choosenEntry == null) {
      localStorage.setItem(dataName, '[]')
    }
  },
  set: function (dataName, item) {
    let tmp = this.get(dataName)
    tmp.push(item)
    localStorage.setItem(dataName, JSON.stringify(tmp))
  },
  get: function (dataName) {
    return JSON.parse(localStorage.getItem(dataName))
  },
  remove: function (dataName) {
    localStorage.removeItem(dataName)
  },
  setElement: function (dataName, keyName, vrednost) {
    let choosenEntry = this.get(dataName)
    choosenEntry[keyName] = vrednost
    this.set(dataName, choosenEntry)
  },
  getElement: function (dataName, keyName) {
    return this.get(dataName)[keyName]
  },
  removeElement: function (dataName, keyName) {
    let choosenEntry = this.get(dataName)
    delete choosenEntry[keyName]
    this.set(dataName, choosenEntry)
  }
};

function trimLS (arr) {
  let tmp = arr.sort((a, b) => {
    return b - a
  });

  return tmp.slice(0, 5)
}

function storeInLS (score) {
  LS.init('currentSession')
  if (score != undefined || score != null) {
    LS.set('currentSession', score)

    let tmp = LS.get('currentSession')
    if (tmp.length == 0) {
      for (let i = 0; i < 5; i++) {
        LS.set('currentSession', 0)
      }
    } else {
      tmp = trimLS(tmp)
      localStorage.setItem('currentSession', JSON.stringify(tmp))
    }
  }
}

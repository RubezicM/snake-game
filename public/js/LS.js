var LS = {
  init: function(imeStavke) {
    var trenutno = localStorage.getItem(imeStavke);
    if (trenutno == null) {
      localStorage.setItem(imeStavke, "[]");
    }
  },
  set: function(imeStavke, item) {
    // LS.set('prvi',{a:5,b:7});
    var tmp = this.get(imeStavke);
    tmp.push(item);
    localStorage.setItem(imeStavke, JSON.stringify(tmp));
  },
  get: function(imeStavke) {
    return JSON.parse(localStorage.getItem(imeStavke));
  },
  remove: function(imeStavke) {
    localStorage.removeItem(imeStavke);
  },
  setElement: function(imeStavke, imeKljuca, vrednost) {
    var trenutno = this.get(imeStavke);
    trenutno[imeKljuca] = vrednost;
    this.set(imeStavke, trenutno);
  },
  getElement: function(imeStavke, imeKljuca) {
    return this.get(imeStavke)[imeKljuca];
  },
  removeElement: function(imeStavke, imeKljuca) {
    var trenutno = this.get(imeStavke);
    delete trenutno[imeKljuca];
    this.set(imeStavke, trenutno);
  }
};

function trimLS(arr) {
  let tmp = arr.sort((a, b) => {
    return b - a;
  });
 
  return tmp.slice(0, 5);
}

function storeInLS(score) {
    LS.init("currentSession");
  if (score != undefined || score != null) {
    LS.set("currentSession", score);
  }
  let tmp = LS.get("currentSession");
  if (tmp.length == 0) {
    for (var i = 0; i < 5; i++) {
      LS.set("currentSession", 0);
    }
  } else {
    console.log(tmp);
    tmp = trimLS(tmp);
    localStorage.setItem("currentSession",JSON.stringify(tmp));
  }
}

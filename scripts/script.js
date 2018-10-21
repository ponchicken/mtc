var loaderBtn = document.getElementById('loaderBtn')

var final = {}
let keys = {
  Vars: {}
}
var primitives = []

// loaderBtn.addEventListener('click', loadData)

loadData()
function loadData () {
  var xhr = new XMLHttpRequest()
  xhr.addEventListener("load", reqListener);
  xhr.open("GET", "http://213.108.129.190/xml/get-temp-data");
  xhr.send();
}


function reqListener () {
  var data = JSON.parse(this.responseText)
  console.log(data)
  analyse(data, 0, '')
  console.log(keys)
  // console.log(primitives)
  console.log(primitives.filter(item => typeof(item.value) == 'object'))
  console.log(primitives.filter(item => item.length > 3))
}



function analyse(data, level, path) {
  level++
  if ( Array.isArray(data) ) {
    data.forEach(item => {
      analyse(item, level, path)
    })
  } else if (typeof(data) === 'object') { 
    Object.keys(data).forEach(key => {
      if (keys[key] !== undefined) primitives.push({
        level: level,
        path: path + '/' + key,
        value: keys[key]
      })
      if (!hasNested(data[key])) keys[key] = data[key]
      else analyse(data[key], level, path + "/" + key)
    })
  } 
}




function hasNested(obj) {
  for( item in obj ) {
    if (typeof(obj[item]) === 'object') return true
  }
  return false
}

function similarObjects(o1, o2) {
  return JSON.stringify(o1) === JSON.stringify(o2) 
}

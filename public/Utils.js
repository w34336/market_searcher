function addImg(itemId) {
  var result = ''
  $.ajax({
    type:'GET',
    url: 'https://api.silveress.ie/bns/v3/items/' + itemId,
    success: function(data){
      var item = data
      console.log(item[0].img)
      $('<img />', {
          src: item[0].img,
          width: '50px',
          height: '50px'
      }).prependTo('.result')
    }
  });
}

function createTable(index, count, total, each, table) {

    let row = table.insertRow(-1);

    let cell_index = row.insertCell(0);
    cell_index.setAttribute("class", "row_index");
    let cell_amount = row.insertCell(1);
    cell_amount.setAttribute("class", "row_count");
    let cell_gsc_total = row.insertCell(2);
    cell_gsc_total.setAttribute("class", "row_gsc_total");
    let cell_gsc_each = row.insertCell(3);
    cell_gsc_each.setAttribute("class", "row_gsc_each");

    cell_index.innerHTML = index;
    cell_amount.innerHTML = count;
    cell_gsc_total.innerHTML = total;
    cell_gsc_each.innerHTML = each;

}

function createTable2(index, count, total, each, table) {

    let row = table.insertRow(-1);

    let cell_index = row.insertCell(0);
    cell_index.setAttribute("class", "row_index");
    let cell_amount = row.insertCell(1);
    cell_amount.setAttribute("class", "row_count");
    let cell_gsc_total = row.insertCell(2);
    cell_gsc_total.setAttribute("class", "row_gsc_total");
    let cell_gsc_each = row.insertCell(3);
    cell_gsc_each.setAttribute("class", "row_gsc_each");


    cell_index.innerHTML = index;
    cell_amount.innerHTML = count;
    cell_gsc_total.innerHTML = total;
    cell_gsc_each.appendChild(each);

}



function cleanup_table() {

  let evt_table = document.getElementById("listing");

  while (evt_table.rows.length > 0){
    evt_table.deleteRow(0);
  }
}

function gsc(price) {
  var result = ''
  g = Math.floor(price / 10000)
  price -= g * 10000
  s = price / 100
  s = Math.floor(price / 100)
  c = price % 100
  if (g != 0) {
    result += g + 'g'
  }
  if (s != 0) {
    result += s + 's'
  }
  if (c != 0) {
    result += c + 'c'
  }
  return result
}

// create a button and append to .result
function createButton(name, val){
  var r=$('<input/>').attr({
      type: 'button',
      id: name,
      value: val

  });
  r.appendTo($('.result'));
}

function getUser() {
  path = window.location.href
  start = path.lastIndexOf("/",path.lastIndexOf("/")-1) + 1
  stop = path.lastIndexOf("/")
  path = path.substr(start, stop-start)
  return path
}




let intervalID

set_list.onclick = async () => {
  const name = document.getElementById("name").value
  const response = await fetch("/api/setList?x=" + name,{
    method: "GET"
  })
}

function addTable(name,done){
  let table = document.getElementById("stay_home_list")
  let newRow = table.insertRow()

  let newCell = newRow.insertCell()
  let newText
  const ch = Object.assign(document.createElement('input'),{type:"checkbox",name:"ch",value:"1"})
  if(done == true)newText = document.createTextNode(ch)
  else newText = document.createTextNode(ch)
  newCell.appendChild(newText)

  newCell = newRow.insertCell()
  newText = document.createTextNode(name)
  newCell.appendChild(newText)
}

async function addlistData(){//リストにデータを表示
  const response = await fetch("/api/getToDoList",{
    method: "GET"
  })
  const json = await response.json()
  const list = json.list
  console.log(list)
  let table = document.getElementById("stay_home_list")
  table.deleteTHead()
  let thead = table.createTHead();
  let newRow = thead.insertRow();

  let newCell = newRow.insertCell()
  let newText = document.createTextNode("やったかチェック")
  newCell.appendChild(newText)

  newCell = newRow.insertCell()
  newText = document.createTextNode("やることの内容")
  newCell.appendChild(newText)
  for(let i = 0;i < list.length;i++){
    addTable(list[i].inside,list[i].done)
  }
}

window.onload = await function() {
  intervalID = setInterval(addlistData,1000)
}
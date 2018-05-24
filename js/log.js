Storage.prototype.setObj = function (key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function (key) {
    return JSON.parse(this.getItem(key))
}

var tableDone = document.getElementById('tableDone');
var tableDo = document.getElementById('tableDo');
var totalTimeDisplay = document.getElementById('totalTime');

let toDoWork = localStorage.getObj('toDoWork') || [];

let toDoWorkDone = localStorage.getObj('toDoWorkDone') || [];
let totalTime = localStorage.getObj('TotalTime') || 0;
let addTotableDone = function(){
    let tableDoneHtml = '<table class="table">  <tbody>';
    for(let i = 0;i < toDoWorkDone.length;i++){
        tableDoneHtml += `
                                      <tr  class="table-active">
                                        <th scope="row">${i+1}</th>
                                        <td>${toDoWorkDone[i]}</td>
                                      </tr>
        `
    }
    tableDoneHtml += '</table> </tbody>';
    tableDone.innerHTML = tableDoneHtml;
    console.log(tableDoneHtml);
}


let addTotableDo = function(){
    let tableDoHtml = '<table class="table">  <tbody>';
    for(let i = 0;i < toDoWork.length;i++){
        tableDoHtml += `   
                                      <tr >
                                        <th scope="row">${i+1}</th>
                                        <td>${toDoWork[i]}</td>
                                      </tr>
        `
    }
    tableDoHtml += '</table> </tbody>';
    tableDo.innerHTML = tableDoHtml;
    console.log(tableDoHtml);
}
let addToTotalTime = function(){
    let hour = parseInt(totalTime/60/60, 10);
    if(hour < 1){
        hour = 0;
    }
    let minute =  parseInt((totalTime - hour*60*60)/60 , 10);
    if(minute < 1){
        minute = 0;
    }
    let seconds = (totalTime - hour*60*60 - minute*60);
    totalTimeDisplay.innerHTML = `<h1>Total Time ${hour} : ${minute} : ${seconds}</h1>`
}
addTotableDone();
addTotableDo();
addToTotalTime();
//DUPLICATES ARE HAPPENING BECAUSE OF " BEING INCLUDED IN NAME :(

//var Papa = require('papaparse');
//global Varibales
var dateFromPicker = null

function clearFile() {
    console.log("button clicked")
    document.getElementById("csv-file").value = null
}

window.onload=function(){
    var dInput = document.getElementById("dateInput");
    dInput.addEventListener("change", handleDateChange);
}

function handleDateChange() {
    var input = this.value;
    var dateEntered = new Date(input + " 00:00:00");
    console.log(input); //e.g. 2015-11-13
    dateFromPicker = dateEntered
    console.log("date changed to:", dateFromPicker)
    //date off by a day due to timezone not being set. -- TODO
    
}


var data;
 
function handleFileSelect(evt) {
  console.log("a2")
  var file = evt.target.files[0];

  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    complete: function(results) {
      data = results;
      
      //document.getElementById('target-id').innerHTML = JSON.stringify(data.data);
     
      data = data.data // new
      var dict = {}
      //var strBuilder = [];
      for(key in data) {
        if (data.hasOwnProperty(key)) {
          //strBuilder.push("Key is " + key + ", date is: " + JSON.stringify(data[key]["Attendance Date"]) + " value is " + JSON.stringify(data[key]["Present Students"]) + "\n");
          var str = "" + JSON.stringify(data[key]["Present Students"])
          str = str.slice(1,-1)
          var splitArr = str.split(",")//split present students into array
          console.log("SPLIT ARRAY IS:", splitArr)
          //now do processing for dictionary
          for(var i in splitArr) {
            if (splitArr[i] in dict){//compare
                dicDate = dict[splitArr[i]]
                var rowDate = new Date(JSON.stringify(data[key]["Attendance Date"]));
                if (rowDate.getTime() > dicDate.getTime()){
                    //update dict[key] w date
                    dict[splitArr[i]] = rowDate
                }

            }
            else{
                var rowDate = new Date(JSON.stringify(data[key]["Attendance Date"]));
                dict[splitArr[i]] = rowDate
            }
          }
        }
      }
      console.log(dict)
      var list = []
      //check 
      //rowDate.getTime() < dateFromPicker.getTime()
      //alert(strBuilder.join(""));
      for (var key in dict){
          if (dict.hasOwnProperty(key)){
              console.log("key:",key, " --- value: ", dict[key])
              if (dict[key].getTime() <= dateFromPicker.getTime()){
                list.push(key)

              }
          }
      }
      var pplStr = list.join(", ")
      //console.log("ppl string :D", pplStr)
      console.log(list.length)
      console.log("plz work dude", dateFromPicker)
      console.log(list)
      document.getElementById('target-id').innerHTML = pplStr
      //document.getElementById('output-box').value = pplStr


    }
  });
}

$(document).ready(function(){
  console.log("a1")
  $("#csv-file").change(handleFileSelect);
});
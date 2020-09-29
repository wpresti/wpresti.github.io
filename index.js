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
    var dateEntered = new Date(input);
    console.log(input); //e.g. 2015-11-13
    //console.log(dateEntered); //e.g. Fri Nov 13 2015 00:00:00 GMT+0000 (GMT Standard Time)
    dateFromPicker = dateEntered
    console.log("date changed to:", dateFromPicker)
    //date off by a day due to timezone not being set. -- TODO
    
}

// document.getElementById("dateInput").addEventListener("change", function() {
//     var input = this.value;
//     var dateEntered = new Date(input);
//     console.log(input); //e.g. 2015-11-13
//     console.log(dateEntered); //e.g. Fri Nov 13 2015 00:00:00 GMT+0000 (GMT Standard Time)
//     dateFromPicker = dateEntered
//     console.log("date changed to:", dateFromPicker)
// });

var data;
 
function handleFileSelect(evt) {
  console.log("a2")
  var file = evt.target.files[0];

  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    complete: function(results) {
      data = results;
      console.log(data)
      document.getElementById('target-id').innerHTML = JSON.stringify(data.data);
      //window.alert(data[0])
      data = data.data // new
      var dict = {}
      var strBuilder = [];
      for(key in data) {
        if (data.hasOwnProperty(key)) {
          strBuilder.push("Key is " + key + ", date is: " + JSON.stringify(data[key]["Attendance Date"]) + " value is " + JSON.stringify(data[key]["Present Students"]) + "\n");
          var str = "" + JSON.stringify(data[key]["Present Students"])
          var splitArr = str.split(",")//split present students into array
          //now do processing for dictionary
          for(var i in splitArr) {
            console.log(splitArr[i])
            if (splitArr[i] in dict){//compare
                dicDate = dict[splitArr[i]]
                var rowDate = new Date(JSON.stringify(data[key]["Attendance Date"]));
                console.log("swag", dicDate.getTime())
                //if (dateFromPicker.getTime() < dicDate.getTime() & True)
                if (rowDate.getTime() > dicDate.getTime() && rowDate.getTime() < dateFromPicker.getTime()){
                    //update dict[key] w date
                    dict[splitArr[i]] = rowDate
                }

            }
            else{
              var dateObj = new Date(JSON.stringify(data[key]["Attendance Date"]));
              if (dateObj.getTime() < dateFromPicker.getTime()){
                  dict[splitArr[i]] = dateObj
              }

            }
          }
        }
      }
      console.log(dict)
      var list = []

      alert(strBuilder.join(""));
      for (var key in dict){
          if (dict.hasOwnProperty(key)){
              console.log("key:",key, " --- value: ", dict[key])
              list.push(key)
          }
      }
      var pplStr = list.join(", ")
      console.log("ppl string :D", pplStr)
      console.log(list.length)


    }
  });
}

$(document).ready(function(){
  console.log("a1")
  $("#csv-file").change(handleFileSelect);
});
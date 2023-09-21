function upload() {
    var files = document.getElementById('file_upload').files;
    if(files.length==0){
      alert("Please choose any file...");
      return;
    }
    var filename = files[0].name;
    var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
    if (extension == '.XLS' || extension == '.XLSX') {
        excelFileToJSON(files[0]);
    }else{
        alert("Please select a valid excel file.");
    }
  }
   
  //Method to read excel file and convert it into JSON 
  function excelFileToJSON(file){
      try {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function(e) {
   
            const data = e.target.result;
            const excel = XLSX.read(data, {
                type : 'binary',
                cellDates:true,
                cellTimes: true
            });
            let  result = {};
            excel.SheetNames.forEach(function(sheetName) {
                var roa = XLSX.utils.sheet_to_row_object_array(excel.Sheets[sheetName]);
                if (roa.length > 0) {
                    result = roa.map(r => {
                        

                        let { title, coords, where, time} = r;

                        let obj = {
                            title: "",
                            coords: {
                                lat: 0,
                                lng: 0            
                            },
                            where: "",
                            time: "",
                            date: "",
                            caption: ''
                        };

                        obj.title = title ?? '';

                        if(typeof coords !== 'undefined'){
                            const c = coords.split(',');
                            obj.coords.lat = c[0];
                            obj.coords.lng = c[1];
                        }

                        console.log(r);
                        obj.where = where ?? '';

                        console.log(r.date);
                        const date = new Date(r.date);
                        const d = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
                        obj.date = d;
            
                        obj.time = time;

                        obj.caption = where + ', ' + d + ', ' + time;

                        

                        //if(location) {
                        //    obj.location = location;
                        //}else {
                        //    delete obj.location
                        //}

                        //if(link) {
                        //    obj.link = link
                        //}else {
                        //    delete obj.link
                        //}
                        //obj.caption = `${address || ''}<br/>${caption || ''}`;
                        //obj.coords.lat = getRandomFloat(45.4500, 45.5000, 4);
                        //obj.coords.lng = getRandomFloat(9.1500, 9.2500, 4);
        
                        return obj;
                    }); 
                }
            });
            //displaying the json result
            var resultEle=document.getElementById("json-result");
            resultEle.value=JSON.stringify(result, null, 4);
            resultEle.style.display='block';
            }
        }catch(e){
            console.error(e);
        }
  }


function getRandomFloat(min, max, decimals) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}
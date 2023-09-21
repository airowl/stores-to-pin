function upload() {
    var files = document.getElementById("file_upload").files;
    if (files.length == 0) {
        alert("Please choose any file...");
        return;
    }
    var filename = files[0].name;
    var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
    if (extension == ".XLS" || extension == ".XLSX") {
        excelFileToJSON(files[0]);
    } else {
        alert("Please select a valid excel file.");
    }
}

//Method to read excel file and convert it into JSON
function excelFileToJSON(file) {
    try {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function (e) {
            const data = e.target.result;
            const excel = XLSX.read(data, {
                type: "binary",
                cellDates: true,
                cellTimes: true,
            });
            let result = {};
            excel.SheetNames.forEach(function (sheetName) {
                var roa = XLSX.utils.sheet_to_row_object_array(
                    excel.Sheets[sheetName]
                );
                if (roa.length > 0) {
                    result = roa.map((r) => {
                        let { title, coords, where, time } = r;

                        let obj = {
                            title: "",
                            where: "",
                            date: "",
                            time: "",
                            caption: "",
                            coords: {
                                lat: 0,
                                lng: 0,
                            },
                        };

                        obj.title = title ?? "";

                        if (typeof coords !== "undefined") {
                            const c = coords.split(",");
                            obj.coords.lat = c[0];
                            obj.coords.lng = c[1];
                        }

                        obj.where = where ?? "";

                        const date = new Date(r.date);
                        const d =
                            date.getDate() +
                            "-" +
                            date.getMonth() +
                            "-" +
                            date.getFullYear();
                        obj.date = d;

                        obj.time = time;

                        obj.caption = where + ", " + d + ", " + time;

                        return obj;
                    });
                }
            });

            const res = {
                pins: result
            };
            //displaying the json result
            var resultEle = document.getElementById("json-result");
            resultEle.value = JSON.stringify(res, null, 4);
            resultEle.style.display = "block";
        };
    } catch (e) {
        console.error(e);
    }
}

function getRandomFloat(min, max, decimals) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}

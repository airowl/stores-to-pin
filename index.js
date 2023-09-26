function upload() {
    var files = document.getElementById("file_upload").files;
    if (files.length == 0) {
        alert("Please choose any file...");
        return;
    }
    var filename = files[0].name; // store.xlsx
    var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase(); // .XLSX
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
            });
            let result = {};
            excel.SheetNames.forEach(function (sheetName) {
                var roa = XLSX.utils.sheet_to_row_object_array(
                    excel.Sheets[sheetName]
                );
                if (roa.length > 0) {
                    result = roa.map((r) => {
                        console.log(r);
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
                            obj.coords.lat = parseFloat(c[0].trim());
                            obj.coords.lng = parseFloat(c[1].trim());
                        }

                        const w = where ?? "";

                        obj.where = w;

                        const t = time ?? "";

                        obj.time = t;

                        obj.caption = w + t;

                        let date = typeof r.date !== 'undefined' ? new Date(r.date) : '';

                        if (date != '') {
                            date =
                                date.getDate() +
                                "-" +
                                (date.getMonth() + 1) +
                                "-" +
                                date.getFullYear();
                        }

                        obj.date = date;

                        if (w == '' && t == '') {
                            obj.caption = date;
                        } else if (w == '' && date == '') {
                            obj.caption = t;
                        } else if (t == '' && date == '') {
                            obj.caption = w;
                        } else {
                            if (w == '') {
                                obj.caption = date + ', ' + t;
                            } else if (t == '') {
                                obj.caption = w + ', ' + date;
                            } else if (date == '') {
                                obj.caption = w + ', ' + t;
                            } else {
                                obj.caption = w + ', ' + date + ', ' + t;
                            }
                        }

                        return obj;
                    });
                }
            });

            const res = {
                pins: result,
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

/**
    Process Infections from the Lancet article. 
    https://docs.google.com/spreadsheets/d/1itaohdPiAeniCXNlntNztZ_oRvjh0HsGuJXUJWET008/edit#gid=0
    https://www.thelancet.com/journals/laninf/article/PIIS1473-3099(20)30119-5/fulltext
*/ 

function valid(value) {
    return value && Math.abs(value) > 0;
}

function milliDate(date) {
    var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
    var dt = new Date(date.replace(pattern,'$3-$2-$1'));
    return dt.getMilliseconds();
}

function oneDate(date1, date2, date3) {
    if (date1 && typeof date1 === 'string' || date1 instanceof String) {
        return milliDate(date1);
    }
    if (date2 && typeof date2 === 'string' || date2 instanceof String) {
        return milliDate(date2);
    }
    if (date3 && typeof date3 === 'string' || date3 instanceof String) {
        return milliDate(date3);
    }
}

function processInfectionsFromLancet(allCSV) {
    var allTextLines = allCSV.split(/\r\n|\n/);

    console.log("Importing Infected Locations: " + allTextLines.length);

    var headings = allTextLines[0].split(',');

    latIdx = headings.findIndex(element => element === '"latitude"');
    longIdx = headings.findIndex(element => element === '"longitude"');
    symp = headings.findIndex(element => element === '"date_onset_symptoms"');
    admission = headings.findIndex(element => element === '"date_admission_hospital"');
    conf = headings.findIndex(element => element === '"date_confirmation"');

    cityIdx = headings.findIndex(element => element === '"city"');
    provinceIdx = headings.findIndex(element => element === '"province"');
    countryIdx = headings.findIndex(element => element === '"country"');
            

    var infections = [];

    var idx = 1;
    while (idx < allTextLines.length) {
        var entry = allTextLines[idx].replace(/\",\"/g, '\"\t\"').replace(/\"/g, '').split('\t');
        if (valid(entry[latIdx]) && valid(entry[longIdx])) {
            infections.push(
                {lat: entry[latIdx], 
                long: entry[longIdx], 
                time: oneDate(symp, admission, conf)} 
            );
            //console.log("Logging: " + entry[cityIdx] + ", " + entry[provinceIdx] + ", " + entry[countryIdx]);
        } else {
            //console.log("Lat Long Not Found for: " + entry[cityIdx] + ", " + entry[provinceIdx] + ", " + entry[countryIdx]);
        }
        idx++;
    }

    console.log("Infections Found: " + infections.length);

    return infections;
}

function loadLancet(onSucess) {
    $.ajax({
        type: "GET",
        url: "https://vitorpamplona.com/coronaviz/data.csv",
        //url: "https://docs.google.com/spreadsheets/d/1itaohdPiAeniCXNlntNztZ_oRvjh0HsGuJXUJWET008/gviz/tq?tqx=out:csv&sheet=outside_Hubei",
        dataType: "text",
        success: function (data) {
            onSucess(processInfectionsFromLancet(data));
        }
    });
}
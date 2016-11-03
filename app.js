
/**
 * Dynamically load response
 *
 * URL derived by AJAX request from:
 * http://www.electionguide.org/elections/?inst=&cont=United+States
 *
 * AJAX URL:
 * http://www.electionguide.org/ajax/election/?sEcho=1&iColumns=5&sColumns=&iDisplayStart=0&iDisplayLength=30&mDataProp_0=0&mDataProp_1=1&mDataProp_2=2&mDataProp_3=3&mDataProp_4=4&sSearch=United+States&bRegex=false&sSearch_0=&bRegex_0=false&bSearchable_0=true&sSearch_1=&bRegex_1=false&bSearchable_1=true&sSearch_2=&bRegex_2=false&bSearchable_2=true&sSearch_3=&bRegex_3=false&bSearchable_3=true&sSearch_4=&bRegex_4=false&bSearchable_4=true&iSortCol_0=3&sSortDir_0=desc&iSortingCols=1&bSortable_0=false&bSortable_1=true&bSortable_2=false&bSortable_3=true&bSortable_4=true&_=1478144688416
 * Cross-domain, but w/ no JSONP support, so ...
 * Using https://jsonp.afeld.me / https://github.com/afeld/jsonp
 */
URL_ELECTION_DATA = "https://jsonp.afeld.me/?url=http%3A%2F%2Fwww.electionguide.org%2Fajax%2Felection%2F%3FsEcho%3D1%26iColumns%3D5%26sColumns%3D%26iDisplayStart%3D0%26iDisplayLength%3D30%26mDataProp_0%3D0%26mDataProp_1%3D1%26mDataProp_2%3D2%26mDataProp_3%3D3%26mDataProp_4%3D4%26sSearch%3DUnited%2BStates%26bRegex%3Dfalse%26sSearch_0%3D%26bRegex_0%3Dfalse%26bSearchable_0%3Dtrue%26sSearch_1%3D%26bRegex_1%3Dfalse%26bSearchable_1%3Dtrue%26sSearch_2%3D%26bRegex_2%3Dfalse%26bSearchable_2%3Dtrue%26sSearch_3%3D%26bRegex_3%3Dfalse%26bSearchable_3%3Dtrue%26sSearch_4%3D%26bRegex_4%3Dfalse%26bSearchable_4%3Dtrue%26iSortCol_0%3D3%26sSortDir_0%3Ddesc%26iSortingCols%3D1%26bSortable_0%3Dfalse%26bSortable_1%3Dtrue%26bSortable_2%3Dfalse%26bSortable_3%3Dtrue%26bSortable_4%3Dtrue%26_%3D1478144688416"

TEXT_N_A = "N/A"

/**
 * Response data looks like this:
 * {
 *   "sEcho": "1",
 *   "aaData": [
 *     [
 *       "https://eguide.s3.amazonaws.com/flags/us.jpg",
 *       [
 *         "United States",
 *         "/countries/id/226/"
 *       ],
 *       [
 *         "House of Representatives",
 *         "/elections/id/2421/"
 *       ],
 *       "2016-11-08",
 *       "Confirmed",
 *       2421,
 *       "House of Representatives",
 *       "Lower House",
 *       226
 *     ],
 *
 *     // ...
 *
 *   ],
 *   "iTotalRecords": 25,
 *   "iTotalDisplayRecords": 25
 * }
 */
function getElectionDateStr(election) {
    return election[3];
}

function getElectionFor(election) {
    return election[2] && election[2][0];
}

// TODO: Finish this one up
function getElectionHTML(election) {
    var flagUrl = election[0];
    if (! flagUrl) {
        return TEXT_N_A;
    }
    var countryData = election[1];
    if (! countryData) {
        return TEXT_N_A;
    }
    var country = countryData[0];
    if (! country) {
        return TEXT_N_A;
    }
    var electionForData = election[2];
    if (! electionForData) {
        return TEXT_N_A;
    }
    var electionFor = electionForData[0];
    if (! electionFor) {
        return TEXT_N_A;
    }
    var electionDate = election[3];
    if (! electionDate) {
        return TEXT_N_A;
    }
    // TODO: Flag looks kinda silly, skipping for now
    // TODO: Country is redundant, since it's only US elections
    return "<img src=\"" + flagUrl + "\" /> " + country + " - " + electionFor + " (" + electionDate + ")";
}

function handleData(data) {
    // console.log(data);
    var elections = data['aaData'];
    if (! elections) {
        $('#next_election').text(TEXT_N_A);
        return;
    }
    var election = elections.shift();
    var electionDate = getElectionDateStr(election);
    if (! electionDate) {
        $('#next_election').text(TEXT_N_A);
        return;
    }
    var ONE_DAY = 24 * 60 * 60 * 1000;
    var daysLeft = Math.round(((new Date(electionDate)).getTime() - (new Date()).getTime()) / (ONE_DAY));
    var nextElectionDate = electionDate + " (" + daysLeft + " days left)";
    $('#next_election_date').text(nextElectionDate);
    var electionFor = getElectionFor(election);
    for (election of elections) {
        var electionDateTest = getElectionDateStr(election);
        if (electionDate == electionDateTest) {
            electionFor += ", " + getElectionFor(election);
        }
    }
    $('#next_election').text(electionFor);
}


function main() {
    $.ajax({
        type: "GET",
        url: URL_ELECTION_DATA,
        dataType: "jsonp",
        success: function(data) {
            handleData(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
     });
}

$(document).ready(main);

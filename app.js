
/**
 * Dynamically load response
 *
 * URL derived by AJAX request from:
 * http://www.electionguide.org/elections/?inst=&cont=United+States&yr=2016
 *
 * AJAX URL:
 * http://www.electionguide.org/ajax/election/?sEcho=1&iColumns=5&sColumns=&iDisplayStart=0&iDisplayLength=30&mDataProp_0=0&mDataProp_1=1&mDataProp_2=2&mDataProp_3=3&mDataProp_4=4&sSearch=United+States+2016&bRegex=false&sSearch_0=&bRegex_0=false&bSearchable_0=true&sSearch_1=&bRegex_1=false&bSearchable_1=true&sSearch_2=&bRegex_2=false&bSearchable_2=true&sSearch_3=&bRegex_3=false&bSearchable_3=true&sSearch_4=&bRegex_4=false&bSearchable_4=true&iSortCol_0=3&sSortDir_0=desc&iSortingCols=1&bSortable_0=false&bSortable_1=true&bSortable_2=false&bSortable_3=true&bSortable_4=true&_=1478138310907
 * Cross-domain, but w/ no JSONP support, so ...
 * Using https://jsonp.afeld.me / https://github.com/afeld/jsonp
 */
URL_ELECTION_DATA = "https://jsonp.afeld.me/?url=http%3A%2F%2Fwww.electionguide.org%2Fajax%2Felection%2F%3FsEcho%3D1%26iColumns%3D5%26sColumns%3D%26iDisplayStart%3D0%26iDisplayLength%3D30%26mDataProp_0%3D0%26mDataProp_1%3D1%26mDataProp_2%3D2%26mDataProp_3%3D3%26mDataProp_4%3D4%26sSearch%3DUnited%2BStates%2B2016%26bRegex%3Dfalse%26sSearch_0%3D%26bRegex_0%3Dfalse%26bSearchable_0%3Dtrue%26sSearch_1%3D%26bRegex_1%3Dfalse%26bSearchable_1%3Dtrue%26sSearch_2%3D%26bRegex_2%3Dfalse%26bSearchable_2%3Dtrue%26sSearch_3%3D%26bRegex_3%3Dfalse%26bSearchable_3%3Dtrue%26sSearch_4%3D%26bRegex_4%3Dfalse%26bSearchable_4%3Dtrue%26iSortCol_0%3D3%26sSortDir_0%3Ddesc%26iSortingCols%3D1%26bSortable_0%3Dfalse%26bSortable_1%3Dtrue%26bSortable_2%3Dfalse%26bSortable_3%3Dtrue%26bSortable_4%3Dtrue%26_%3D1478138310907"

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
 *         "President",
 *         "/elections/id/2370/"
 *       ],
 *       "2016-11-08",
 *       "Confirmed",
 *       2370,
 *       "President",
 *       "Head of State",
 *       226
 *     ],
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
 *     [
 *       "https://eguide.s3.amazonaws.com/flags/us.jpg",
 *       [
 *         "United States",
 *         "/countries/id/226/"
 *       ],
 *       [
 *         "Senate",
 *         "/elections/id/2422/"
 *       ],
 *       "2016-11-08",
 *       "Confirmed",
 *       2422,
 *       "Senate",
 *       "Upper House",
 *       226
 *     ]
 *   ],
 *   "iTotalRecords": 3,
 *   "iTotalDisplayRecords": 3
 * }
 */
function handleData(data) {
    // console.log(data);
    var electionDate = new Date(data['aaData'][0][3]);
    var isElectionSeasonOver = new Date() > electionDate ? "Yes" : "No";
    $('#answer').text(isElectionSeasonOver);
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

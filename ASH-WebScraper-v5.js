
// Console API to clear console before logging new data
// console.API;
// if (typeof console._commandLineAPI !== 'undefined') {
//     console.API = console._commandLineAPI; //chrome
// } else if (typeof console._inspectorCommandLineAPI !== 'undefined') {
//     console.API = console._inspectorCommandLineAPI; //Safari
// } else if (typeof console.clear !== 'undefined') {
//     console.API = console;
// }

////////////////////////////////ASH Web Scraper/////////////////////////////////////


var rec = "",
rowId = 0,
get = copy,     //this feature works in chrome
cellId = 0,
pageNumber = 1,
ajaxModalStatus = 2,    //ready for skip
total = document.querySelector('span[wicketpath="pageContainer_ajaxIndicatorContainer_panel_content_form_numofpage"]').innerHTML;
///////////////////////////////////////////////////////////////////////////////////////////////

function getRow(){
    for (i = 0 ; i < 4 ; i++) {
        rec += tbl[cellId].textContent + "\t";
        cellId++;
    }
    ajaxModalStatus = 1;
    $('button[name="list:'+rowId+':send"]').click();  //open modal
    rowId++;
}

function getTable() {
    tbl = $(".row.table.table-bordered.table-striped.table-hover tr>td>span");
}

function getDetail() {
    $(".modal-body input:disabled").each(function(t,v){rec += v.value + "\t"});   //get details
    $('div.modal-backdrop.fade.in').click();    //close modal
    rec += "\n";
}

function skip(n) {
    console.log("Starting Point, Page:", pageNumber);
    for(j=0;j<n;j++) {
        nextPage();
    }
}

function startOver() {
    console.time("Start Over");
    getTable();
    ajaxModalStatus = 1;
    cellId = 0;
    rowId = 0;
    getRow(); 
}

function nextPage(status = 2) { 
    get(rec);
    ajaxModalStatus = status;
    console.timeEnd("Start Over");
    if(status==0) console.log("CurrentPage: ", ++pageNumber);
    $('button[name="next"]').click();
}

function jobDone() {
    get(rec);
    console.log("Job Done!");
    alert("Data Extraction Completed!\n" + pageNumber + " Pages\nPaste it somewhere...");
}

////////////////////////////////////////////////////////////////////////////////////
$(document).ajaxStop(() => {
    if(ajaxModalStatus===1) {
        getDetail();
        if(cellId < tbl.length) getRow();  //go for next row if available
            else if(total != pageNumber) nextPage(0);  //go for next page if available
                else jobDone();
    } else if(ajaxModalStatus===2) console.log("CurrentPage: ", ++pageNumber);  //do nothing if skip called
        else startOver();   //after next page ajax stop, start over
});
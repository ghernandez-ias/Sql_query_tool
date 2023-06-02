var dropdown;
var userSelection;



var sub_button;
var sub_button ;



var lbl_cmp_tags;
var radio_yes;
var radio_no;
var lbl_yes;
var lbl_no;

var lbl_cmp;
var lbl_old_tm;
var lbl_new_tm;

var campaign_id;
var old_team_id;
var new_team_id;

var jiraid;
var jiraiderror;

var insertValStr = "";
var userTeamId = "";

const forms = document.getElementById("forms");
const inputs = document.querySelectorAll("#forms input");
var lbl_error = document.getElementById("form-input-error");
let regex = /^\d+(,\d+)*$/;

let regex_viewability = /^\d+$/;


let myData;

function loadJSON(callback) {   

  var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
  xobj.open('GET', './../queries.json', true); // Replace 'path/to/your/file.json' with the actual path to your JSON file
  xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
          myData = JSON.parse(xobj.responseText);
          callback(myData);
        }
  };
  xobj.send(null);  
}

loadJSON(function(json) { });

const fields = {
    "campaign": false,
    "old-team": true,
    "new-team": true
};
const validateForm = (e) =>{
    switch(e.target.id){
      case "campaign_id":
              validateField(regex, e.target, "campaign");
      break;
      case "old_team_id":
              validateField(regex, e.target, "old-team");
      break;
      case "new_team_id":
              validateField(regex, e.target, "new-team");
      break;
      case "disabled_fl":
              validateField(regex_viewability, e.target, "disable")
    }
};
const validateField = (regex, input, field) =>{
      if(regex.test(input.value)){
          document.getElementById(`group__${field}`).classList.remove("form__group-wrong");
          document.getElementById(`group__${field}`).classList.add("form__group-correct");
          document.querySelector(`#group__${field} .form__input-error`).classList.remove("form__input-error-active");
          fields[field] = true;
      }else{
          document.getElementById(`group__${field}`).classList.add("form__group-wrong");
          document.getElementById(`group__${field}`).classList.remove("form__group-correct");
          document.querySelector(`#group__${field} .form__input-error`).classList.add("form__input-error-active");
          fields[field] = false;
       }
};
  
inputs.forEach((input)=>{
      input.addEventListener("keyup", validateForm);
      input.addEventListener("blur", validateForm);
});
  
function validation(){
      jiraiderror.style.visibility = "hidden";
      if(jiraid.value == ""){
          jiraiderror.style.visibility = "visible";
      }
      if(fields.campaign && fields["old-team"] && fields["new-team"] && jiraid.value != ""){
        document.getElementById("form__message").classList.add("form__message-inactive");
        jiraiderror.style.visibility = "hidden";
        return true;
      }else{
        document.getElementById("form__message").classList.add("form__message-active")
        return false;
      }
  
};


// -- Function checks what option user selected from dropdown -- //
function getIndex() {
  dropdown=document.getElementById("mySelect");
  userSelection = dropdown.selectedIndex;
  default_func('hide');
  
  // document.getElementById("demo").innerHTML =userSelection;

if(userSelection=='1'){

radio_yes.checked=false;
radio_no.checked=false;

lbl_cmp_tags.style.display='block';

radio_yes.style.display='block';
radio_no.style.display='block';
lbl_yes.style.display='block';
lbl_no.style.display='block';
document.querySelector(`#group__disable .form__input-error`).classList.remove("form__input-error-active");

  }else if(userSelection=='2'){

    default_func('show','2');
    document.querySelector(`#group__new-team .form__input-error`).classList.remove("form__input-error-active");
    document.querySelector(`#group__disable .form__input-error`).classList.remove("form__input-error-active");

  }else if(userSelection == '3'){
    default_func('show', '3');
    document.querySelector(`#group__new-team .form__input-error`).classList.remove("form__input-error-active");
    document.querySelector(`#group__disable .form__input-error`).classList.remove("form__input-error-active");
  }else if(userSelection == '4'){
    default_func('show', '4');
    document.querySelector(`#group__old-team .form__input-error`).classList.remove("form__input-error-active");
    document.querySelector(`#group__new-team .form__input-error`).classList.remove("form__input-error-active");
    document.querySelector(`#group__disable .form__input-error`).classList.remove("form__input-error-active");
  }else if(userSelection == '5'){
    default_func('show', '5');
    document.querySelector(`#group__old-team .form__input-error`).classList.remove("form__input-error-active");
    document.querySelector(`#group__new-team .form__input-error`).classList.remove("form__input-error-active");
  }else if(userSelection == '6'){
    default_func('show', '6');
    document.querySelector(`#group__old-team .form__input-error`).classList.remove("form__input-error-active");
    document.querySelector(`#group__new-team .form__input-error`).classList.remove("form__input-error-active");
    document.querySelector(`#group__disable .form__input-error`).classList.remove("form__input-error-active");
  }else if(userSelection == '7'){
    default_func('show', '7');
    document.querySelector(`#group__old-team .form__input-error`).classList.remove("form__input-error-active");
    document.querySelector(`#group__new-team .form__input-error`).classList.remove("form__input-error-active");
    document.querySelector(`#group__disable .form__input-error`).classList.remove("form__input-error-active");
  }

}


// --- Function extracts ids from an array --- //

function joinInsertIDs(item, index) {
  insertValStr += "("+item + ", " + userTeamId + "),\n"; 

}

function generateFiles(sqlContent,sqlRollbackContent){
    bbSQL = new Blob([sqlContent ], { type: 'text/plain' });
    a = document.createElement('a');
    a.download = trimfield(jiraid.value)+'_Firewall_Update.sql';
    a.href = window.URL.createObjectURL(bbSQL);
    a.click();


    bbSQL = new Blob([sqlRollbackContent ], { type: 'text/plain' });
    a = document.createElement('a');
    a.download = trimfield(jiraid.value)+'_Firewall_Update_ROLLBACK.sql';
    a.href = window.URL.createObjectURL(bbSQL);
    a.click();
    location.reload();
}

// - Function triggered when Generate Query button clicked -- //

function click_submit(){

  if(userSelection=='1' && validation()){
    
    sqlContent = myData.campaign_to_team.content.replace("${new_team_id}", trimfield(new_team_id.value)).replace("${campaign_id}", trimfield(campaign_id.value));
    sqlRollbackContent = myData.campaign_to_team.rollback.replace("${old_team_id}", trimfield(old_team_id.value)).replace("${campaign_id}", trimfield(campaign_id.value));
  
    generateFiles(sqlContent, sqlRollbackContent);

  }else if(userSelection=='2' && validation()){
    var queries = [];
    const array = campaign_id.value.split(",");
    const array2 = old_team_id.value.split(",");
    tb = "use firewall;\n";
    queries.push(tb);
    queries.push(myData.users_to_team.content);
    var l = array.length;
    var m = array2.length;
    for (let i = 0; i < l; i++) {
      for (let j = 0; j < m; j++) {
        console.log(l, m);
        console.log(array[i], array2[j]);
        sqlContent = "      (" + array[i] + ", " + array2[j] + ")";
        if (i === l - 1 && j === m - 1) {
          sqlContent += ";\n";
        } else {
          sqlContent += ",\n";
        }
        queries.push(sqlContent);
      }
    }


    new_queries = queries.join("");
    sqlRollbackContent = myData.users_to_team.rollback.replace("${campaign_id}", trimfield(campaign_id.value)).replace("${old_team_id}", trimfield(old_team_id.value));

    generateFiles(new_queries, sqlRollbackContent);


  }else if(userSelection=='3' && validation()){
    var queries = [];
    const array = campaign_id.value.split(",");
    const array2 = old_team_id.value.split(",");
    tb = "use firewall;\n";
    queries.push(tb);
    queries.push(myData.disable_placements.content);
    var l = array.length;
    var m = array2.length;
    for (let i = 0; i < l; i++) {
      for (let j = 0; j < m; j++) {
        console.log(l, m);
        console.log(array[i], array2[j]);
        sqlContent = "      (" + array[i] + ", " + array2[j] + ",1,48344,Now())";
        if (i === l - 1 && j === m - 1) {
          sqlContent += ";\n";
        } else {
          sqlContent += ",\n";
        }
        queries.push(sqlContent);
      }
    }
    new_queries = queries.join("");
    sqlRollbackContent = myData.disable_placements.rollback.replace("${campaign_id}", trimfield(campaign_id.value)).replace("${disabled_fl}", trimfield(disabled_fl.value));

    generateFiles(new_queries, sqlRollbackContent);

  }else if(userSelection=='4' && validation()){
    sqlContent = myData.reset_user.content.replace('${user_id}', trimfield(campaign_id.value));
    sqlRollbackContent = myData.reset_user.rollback.replace('${user_id}', trimfield(campaign_id.value));

    generateFiles(sqlContent, sqlRollbackContent);


  }else if(userSelection == '5' && validation()){
    var queries = [];
    const array = campaign_id.value.split(",");
    tb = "use firewall;\n";

    queries.push(tb);
    queries.push(myData.custom_viewability.content);

    var l = array.length;
    for (let i = 0; i< array.length; i++){
      if(l>1){
        sqlContent = "      ("+array[i]+","+disabled_fl.value+",0,now(),48344)\n";
        queries.push(sqlContent);
        l = l-1;
      }else{
        sqlContent = "      ("+array[i]+","+disabled_fl.value+",0,now(),48344);\n";
        queries.push(sqlContent);
      }
    }
    new_queries = queries.join("");
    sqlRollbackContent = myData.custom_viewability.rollback.replace("${team_id}", trimfield(campaign_id.value)).replace("${viewability_id}", trimfield(disabled_fl.value));

    generateFiles(new_queries, sqlRollbackContent);

  }else if(userSelection == '6' && validation()){
    sqlContent = myData.pub_entity.content.replace("${pub_entity_id}", trimfield(campaign_id.value));
    sqlRollbackContent = myData.pub_entity.rollback.replace("${pub_entity_id}", trimfield(campaign_id.value));

    generateFiles(sqlContent, sqlRollbackContent);

  }else if(userSelection == '7' && validation()){
    var queries = []
    var queries_rollback = []

    tb = "USE firewall;\n"
    queries.push(tb);
    queries_rollback.push(tb);

    const id_array = campaign_id.value.split(",");
    const id_old_placement = old_placement.value.split(",");
    const id_new_placement = placement_name.value.split(",");

    if(id_array.length == id_old_placement.length && id_array.length == id_new_placement.length){
      for(let i = 0; i< id_array.length; i++){
        sqlContent = myData.placement_name.content.replace("${placement_name}", trimfield(id_new_placement[i])).replace("${placement_id}", id_array[i]);
        queries.push(sqlContent);

        sqlRollbackContent = myData.placement_name.rollback.replace("${placement_name}", trimfield(id_old_placement[i])).replace("${placement_id}", id_array[i]);
        queries_rollback.push(sqlRollbackContent);
      }
      new_queries = queries.join("");
      new_rollback = queries.join("");

      generateFiles(new_queries, new_rollback);

    }else{
      alert('Please make sure all entries have the same length');
      return false;
    }

  }

}

// - Trim String Function -- //

function trimfield(str) 
{ 
    return str.replace(/^\s+|\s+$/g,''); 
}

// Restricts input for the given textbox to the given inputFilter function.
function setInputFilter(textbox, inputFilter, errMsg) {
  [ "input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout" ].forEach(function(event) {
    textbox.addEventListener(event, function(e) {
      if (inputFilter(this.value)) {
        // Accepted value.
        if ([ "keydown", "mousedown", "focusout" ].indexOf(e.type) >= 0){

          this.classList.remove("input-error");
          this.setCustomValidity("");
        }

        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      }
      else if (this.hasOwnProperty("oldValue")) {
        // Rejected value: restore the previous one.
        this.classList.add("input-error");
        this.setCustomValidity(errMsg);
        this.reportValidity();
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);

      }
      else {
        // Rejected value: nothing to restore.
        this.value = "    ()";
      }
    });
  });
}


// --- Radio Button Event Handler Function --- //

function handleRadioClick(myRadio){

     //document.getElementById("yes")
    // alert(myRadio.id)
    // currentValue = myRadio.value;

   if(myRadio.id=='yes'){

lbl_cmp_tags.style.display='block';
radio_yes.style.display='none';
radio_no.style.display='none';
lbl_yes.style.display='none';
lbl_no.style.display='none';
lbl_cmp_tags.innerHTML='If tags are already generated, moving this campaign to new team may cause data sync issues. Please contact TEOM team if the campaign still need to be moved.'

   }else{


lbl_cmp_tags.style.display='none';
radio_yes.style.display='none';
radio_no.style.display='none';
lbl_yes.style.display='none';
lbl_no.style.display='none';
  default_func('show','1');
   }
}
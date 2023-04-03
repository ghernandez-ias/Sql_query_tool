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

  }else if(userSelection=='2'){

    default_func('show','2');


  }else if(userSelection == '3'){
    default_func('show', '3');
  }else if(userSelection == '4'){
    default_func('show', '4');
  }else if(userSelection == '5'){
    default_func('show', '5');
  }else if(userSelection == '6'){
    default_func('show', '6');
  }else if(userSelection == '7'){
    default_func('show', '7');
  }

}


// --- Function extracts ids from an array --- //

function joinInsertIDs(item, index) {
  insertValStr += "("+item + ", " + userTeamId + "),\n"; 

}

function resetForm(){
  var form_reset = document.getElementById('forms');
  form_reset.reset()

  for (const prop in fields) {
    fields[prop] = false; //
  }
}




// - Function triggered when Generate Query button clicked -- //

function click_submit(){
  //const message = eval(s1 + myData + s2);
  //console.log(message)

  if(userSelection=='1' && validation()){

    //sqlContent = "use firewall;\nUPDATE ADV_ENTITY SET TEAM_ID="+trimfield(new_team_id.value)+" WHERE ID IN("+trimfield(campaign_id.value)+");";
    //sqlRollbackContent = "use firewall;\nUPDATE ADV_ENTITY SET TEAM_ID="+trimfield(old_team_id.value)+" WHERE ID IN("+trimfield(campaign_id.value)+");";
    
    sqlContent = myData.campaign_to_team.content.replace("${new_team_id}", trimfield(new_team_id.value)).replace("${campaign_id}", trimfield(campaign_id.value));
    sqlRollbackContent = myData.campaign_to_team.rollback.replace("${old_team_id}", trimfield(old_team_id.value)).replace("${campaign_id}", trimfield(campaign_id.value));
    
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
    resetForm();

  }else if(userSelection=='2' && validation()){

    userTeamId = trimfield(old_team_id.value);
    insertValStr = "";

    const userArray = trimfield(campaign_id.value).split(",");
    userArray.forEach(joinInsertIDs);

    var result = insertValStr.substring(0,insertValStr.length-2)+";";

    //sqlContent = "use app_user;\nINSERT INTO `user_team` (`user_id`, `team_id`) VALUES "+result;
    
    //sqlRollbackContent = "use app_user;\nDELETE FROM user_team WHERE user_id IN("+trimfield(campaign_id.value)+") AND team_id="+trimfield(old_team_id.value)+";";

    // document.getElementById("demo").innerHTML = sqlRollbackContent;
    sqlContent = myData.users_to_team.content + result;
    sqlRollbackContent = myData.users_to_team.rollback.replace("${campaign_id}", trimfield(campaign_id.value)).replace("${old_team_id}", trimfield(old_team_id.value));

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





  }else if(userSelection=='3' && validation()){
    var queries = [];
    //sqlContent = "use firewall;\nINSERT INTO `PLACEMENT_DISABLEMENT_LOG` (`PLACEMENT_ID`, `ADSERVER_LOOKUP_ID`, `DISABLED_FL`, `CREATED_BY`, `CREATED_ON`) ";
    const array = campaign_id.value.split(",");
    tb = "use firewall;\n";
    queries.push(tb);
    //query_template = "INSERT INTO `PLACEMENT_DISABLEMENT_LOG` (`PLACEMENT_ID`, `ADSERVER_LOOKUP_ID`, `DISABLED_FL`, `CREATED_BY`, `CREATED_ON`)\nVALUES\n";
    queries.push(myData.disable_placements.content);
    var l = array.length;
    for (let i = 0; i< array.length; i++){
      if(l > 1){
          sqlContent = "      ("+array[i]+","+old_team_id.value+","+disabled_fl.value+","+created_by.value+", Now()),\n";
          queries.push(sqlContent);
          l = l - 1;
      }else{
        sqlContent = "      ("+array[i]+","+old_team_id.value+","+disabled_fl.value+","+created_by.value+", Now());\n";
        queries.push(sqlContent);
      }
    }
    new_queries = queries.join("");
    bbSQL = new Blob([new_queries], { type: "text/plain" });
    a = document.createElement("a");
    a.download = trimfield(jiraid.value)+"_Firewall_Update.sql";
    a.href = window.URL.createObjectURL(bbSQL);
    a.click();

    //sqlRollbackContent = "use firewall;\nDELETE FROM `PLACEMENT_DISABLEMENT_LOG` where PLACEMENT_ID in("+trimfield(campaign_id.value)+") AND DISABLED_FL="+trimfield(disabled_fl.value)+";";
    sqlRollbackContent = myData.disable_placements.rollback.replace("${campaign_id}", trimfield(campaign_id.value)).replace("${disabled_fl}", trimfield(disabled_fl.value));
    bbSQL = new Blob([sqlRollbackContent ], { type: "text/plain" });
    a = document.createElement("a");
    a.download = trimfield(jiraid.value)+"_Firewall_Update_ROLLBACK.sql";
    a.href = window.URL.createObjectURL(bbSQL);
    a.click();
  }else if(userSelection=='4' && validation()){
    sqlContent = myData.reset_user.content.replace('${user_id}', trimfield(campaign_id.value));

    bbSQL = new Blob([sqlContent ], { type: 'text/plain' });
    a = document.createElement('a');
    a.download = trimfield(jiraid.value)+'_Firewall_Update.sql';
    a.href = window.URL.createObjectURL(bbSQL);
    a.click();

    sqlRollbackContent = myData.reset_user.rollback.replace('${user_id}', trimfield(campaign_id.value));

    bbSQL = new Blob([sqlRollbackContent ], { type: 'text/plain' });
    a = document.createElement('a');
    a.download = trimfield(jiraid.value)+'_Firewall_Update_ROLLBACK.sql';
    a.href = window.URL.createObjectURL(bbSQL);
    a.click();
  }else if(userSelection == '5' && validation()){
    var queries = [];
    const array = campaign_id.value.split(",");
    tb = "use firewall;\n";

    queries.push(tb);
    queries.push(myData.custom_viewability.content);

    var l = array.length;
    for (let i = 0; i< array.length; i++){
      if(l>1){
        sqlContent = "      ("+array[i]+","+old_team_id.value+","+disabled_fl.value+",now(),"+created_by.value+")\n";
        queries.push(sqlContent);
        l = l-1;
      }else{
        sqlContent = "      ("+array[i]+","+old_team_id.value+","+disabled_fl.value+",now(),"+created_by.value+");\n";
        queries.push(sqlContent);
      }
    }
    new_queries = queries.join("");
    bbSQL = new Blob([new_queries], { type: "text/plain" });
    a = document.createElement("a");
    a.download = trimfield(jiraid.value)+"_Firewall_Update.sql";
    a.href = window.URL.createObjectURL(bbSQL);
    a.click();

    sqlRollbackContent = myData.custom_viewability.rollback.replace("${team_id}", trimfield(campaign_id.value)).replace("${viewability_id}", trimfield(old_team_id.value));
    bbSQL = new Blob([sqlRollbackContent ], { type: "text/plain" });
    a = document.createElement("a");
    a.download = trimfield(jiraid.value)+"_Firewall_Update_ROLLBACK.sql";
    a.href = window.URL.createObjectURL(bbSQL);
    a.click();
  }else if(userSelection == '6' && validation()){
    sqlContent = myData.pub_entity.content.replace("${pub_entity_id}", trimfield(campaign_id.value));
    bbSQL = new Blob([sqlContent ], { type: 'text/plain' });
    a = document.createElement('a');
    a.download = trimfield(jiraid.value)+'_Firewall_Update.sql';
    a.href = window.URL.createObjectURL(bbSQL);
    a.click();

    sqlRollbackContent = myData.pub_entity.rollback.replace("${pub_entity_id}", trimfield(campaign_id.value));
    bbSQL = new Blob([sqlRollbackContent ], { type: 'text/plain' });
    a = document.createElement('a');
    a.download = trimfield(jiraid.value)+'_Firewall_Update_ROLLBACK.sql';
    a.href = window.URL.createObjectURL(bbSQL);
    a.click();
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
var banking_payer_table_id = 0;

$(document).ready(function(){
	button_create_banking_payer(1);
	banking_payer_table_display();
});

function banking_payer_table_display(){
	$.ajax({	
		type  : 'POST',
		url   : '/banking_payer_table_display/',
		async : false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		console.log(data)
		if(data){
			banking_payer_datatable_function(data)
		}else{
			banking_payer_datatable_function(data)
		}
		
	});

}

function banking_payer_datatable_function(data)
{
	datatable_list = []
	if(data.length > 0){
		datatable_list = []
		for(var i=0;i<data.length;i++){
			list = []
			var sno = i+1
			list.push(data[i].id,sno,data[i].org_name,data[i].payer_description,data[i].payer_bank_code,data[i].payer_branch_code,data[i].payer_account_no);
			datatable_list.push(list);
		}

		columns = [{'title':'ID'},{'title':'No.'},{'title':'Organization Name'},{'title':'Description'},{'title':'Bank Code'},{'title':'Branch Code'},{'title':'Account No'}]
		plaindatatable_btn('banking_payer_tbl_details', datatable_list, columns,0);
	}else{
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Organization Name'},{'title':'Description'},{'title':'Bank Code'},{'title':'Branch Code'},{'title':'Account No'}]
		plaindatatable_btn('banking_payer_tbl_details', datatable_list, columns,0);
	}
	
	return false
}

$("#banking_payer_tbl_details").on("click", "tr", function() {   
	var id = $('#banking_payer_tbl_details').dataTable().fnGetData(this)[0];
	//reg_table_id = id
	if (id != 'No data available'){
		banking_payer_table_row_click(id);
	}
});

function banking_payer_table_row_click(el){
	button_create_banking_payer(0);
	$.ajax(
			{
				type:"GET",
				url: "/banking_payer_table_row_click/",
				async: false,
				data : {'id':el},
				success: function (json_data) {
					console.log(json_data)
					data=JSON.parse(json_data);
					for (i=0;i<data.length;i++){
						banking_payer_table_id = data[i].id;
						console.log(data[i].payer_description)
						$('#payer_company_name').val(data[i].organization_id).trigger('change'); 
						$('#payer_description').val(data[i].payer_description);
						$("#payer_bank_code").val(data[i].payer_bank_code).trigger('change');
						$('#payer_branch_code').val(data[i].payer_branch_code).trigger('change');
						$('#payer_acccount_type').val(data[i].payer_account_type).trigger('change');
						$('#payer_account_number').val(data[i].payer_account_no)
						//get form value for field wise log list function
						//payroll_activity_log_attribute_value('#tds_form')
					}
				}
			});
	return false;
}

//button create function here
function button_create_banking_payer(status){
	var access_for_create = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Delete) );	
	if(status == 1){
		strAppend = "<button type='button' onclick='banking_payer_create()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		strAppend += " <button type='button' onclick='banking_payer_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
		console.log(strAppend)
		$('#banking_payer_btn').html(strAppend);
	}else{
		strAppend = "<button type='button' onclick='banking_payer_update()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
			strAppend += " <button type='button' onclick='banking_payer_delete()' class='btn btn-danger btn-eql-wid btn-animate '>Remove</button>"
		/*if (access_for_delete != -1){
			alert(0)
			
		}*/
				strAppend += " <button type='button' onclick='banking_payer_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
					$('#banking_payer_btn').html(strAppend);
	}
}

function banking_payer_create() {
	if(banking_payer_form_validation())
	{
		banking_payer_create_function();
	}
}

function banking_payer_update(){
	banking_payer_create();
}

function banking_payer_create_function()
{
	var banking_payer_form_value = getFormValues("#banking_payer_form");
	var csrf_data = banking_payer_form_value.csrfmiddlewaretoken;
	delete banking_payer_form_value["csrfmiddlewaretoken"];
	banking_payer_form_value['is_active'] = "True";

	banking_payer_form_value['payer_company_id'] = validationFields(banking_payer_form_value['payer_company_id']);
	banking_payer_form_value['payer_description'] = validationFields(banking_payer_form_value['payer_description']);
	//tds_form_value['tds_category'] = 1;
	banking_payer_form_value['payer_bank_code'] = validationFields(banking_payer_form_value['payer_bank_code']);
	banking_payer_form_value['payer_branch_code'] = validationFields(banking_payer_form_value['payer_branch_code']);
	banking_payer_form_value['payer_account_type'] = validationFields(banking_payer_form_value['payer_account_type']);
	banking_payer_form_value['payer_account_number'] = validationFields(banking_payer_form_value['payer_account_number']);
        console.log(banking_payer_form_value)
	banking_payer_list = [];
	banking_payer_dict = {};
	banking_payer_list.push(banking_payer_form_value);
	banking_payer_dict['banking_payer_data'] = banking_payer_list;
	
	$.ajax({	
		type  : 'POST',
		url   : '/banking_payer_create/',
		async : false,
		data: {
			'datas': JSON.stringify(banking_payer_dict),
			"table_id": banking_payer_table_id,
			csrfmiddlewaretoken: csrf_data,
		}
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_01') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_banking_payer(1);
			banking_payer_clear();
			banking_payer_table_display();
			//tds_activity_list = []
			//payroll_log_activity();
		}else if(res_status == 'NTE_03') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_banking_payer(1)
			banking_payer_clear();
			banking_payer_table_display();	
			//tds_activity_list = []
			//payroll_log_activity();
		}
		else {
			alert_lobibox("error",sysparam_datas_list['ERR0040'])
		}
	});
}

//delete function
function banking_payer_delete(){
	var banking_payer_title = $('#arrear_employe_name option:selected').text();
	removeConfirmation('arrear_details_delete_function','',arrear_title);
}

//delete function
function banking_payer_details_delete_function(){
	$.ajax({	
		type  : 'POST',
		url   : '/banking_payer_create/',
		async : false,
		data: {
			"delete_id": banking_payer_table_id,
			csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val(),
		},
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_04') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_arrear(0)
			banking_payer_clear();
			banking_payer_table_display();
			//tds_activity_list = []
			//payroll_log_activity();
		}
		else {
			alert_lobibox("error",sysparam_datas_list['ERR0028'])
		}
	});
}


function dateFormatChange(val){
	return val.split('-')[2]+'-'+val.split('-')[1]+'-'+val.split('-')[0]
}

function banking_payer_form_validation()
{
	return $('#banking_payer_form').valid();
}

//validation for the empty
function validationFields(val){
	return val=='' || val =='0' ?null:val 
}

$.validator.addMethod("alpha", function(value, element) {
    return this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/);
});

//validation for the empty
function validationFieldsamount(val){
	return val==''  ?null:val 
}

//contribution register form validation
$('#banking_payer_form').submit(function(e) {
	e.preventDefault();    
}).validate({
	rules: {
		payer_company_name: {
			required: true,
			valueNotEquals:true,
		},	
		payer_description: {
			required: true,
		},
		payer_bank_code: {
			required: true,
			valueNotEquals:true, 
		},
		arrear_from_date: {
			required: true,
			//number:true, 
		},	  
		arrear_to_date: {
			required: true,
			greaterThan: "From date"
			//valueNotEquals:true, 
		},
	},
	//For custom messages
	messages: {
		payer_company_name: {
			required: "Select Organization",
			valueNotEquals: "Select Organization",
		},
		payer_description: {
			required: "Select Payer Description",
		},	
		arrear_type_id: {
			required: "Select Arrear Type",
			valueNotEquals: "Select Arrear Type", 
		},
		arrear_from_date: {
			required: "Enter From Date",
			//number: "Enter only a number", 
		},
		arrear_to_date: {
			required: "Enter To Date",
			//number: "Enter only a number", 
		},

	},
	errorElement: 'div',
	errorPlacement: function(error, element) {
		var placement = $(element).data('error');
		if (placement) {
			$(placement).append(error)
		} else {
			error.insertAfter(element);
		}
	},
	ignore: []
});

$('#arrear_employe_name').change(function() {
	$('.errormessage').html("");
});
$('#arrear_type_name').change(function() {
	$('.errormessage').html("");
});

function banking_payer_clear(){
	button_create_banking_payer(1);
	banking_payer_table_id = 0
	$('.thumbnail').html("")
	$('.errormessage').html("");	
	$('#payer_company_name').val(0).trigger('change'); 
	$('#payer_description').val(''); 
	$('#payer_bank_code').val(0).trigger('change');
	$("#payer_branch_code").val(0).trigger('change');
	$("#payer_acccount_type").val(0).trigger('change');
	$("#payer_account_number").val('');
}

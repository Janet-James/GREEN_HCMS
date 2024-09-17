$(document).ready(function(){
	//view_button_create();
	
	$("#banking_employee_id").attr('placeholder',"-- Select An Employee --");
	$("#banking_organization_id").attr('placeholder',"-- Select An Organization --");
//	$("#banking_employee_id").select2({
//	    placeholder: "--Select An Employee--",
//	   // allowClear: true
//	});

	$("#banking_organization_id")
}); 

$("#banking_organization_id").on("change", function(e) {
console.log($('#banking_organization_id').select2("val"));
banking_organization_id_list=$('#banking_organization_id').select2("val")
		$.ajax({
			url : "/bank_format_org_based_emploee/",
			type : "POST",
			data : {'org_id_list':JSON.stringify(banking_organization_id_list)},
			async:false,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			console.log(data)
			if (data){
				$('#banking_employee_id').val(data.employee_ids).trigger('change')
			}
			else{
				$('#banking_employee_id').val('').trigger('change')
			}
			$("#banking_employee_id").attr('placeholder',"-- Select An Employee --");
			$("#banking_organization_id").attr('placeholder',"-- Select An Organization --");
		});

});

function banking_report_button(){
	var banking_employee_id_list = [];
	$.each($("#banking_employee_id option:selected"), function(){     
		banking_employee_id_list.push($(this).val());
	});
	var from_date = $("#banking_dtimepicker1").val()
	var to_date = $("#banking_dtimepicker2").val()
	var payer_financial_institution =$("#payer_financial_institution").val()
	var payer_name = $("#payer_name").val()
	var payer_client_no = $("#payer_client_no").val()
	var payment_type = $("#payment_type").val()
	var payment_description = $("#payment_description").val()
	if(banking_employee_id_list.length>0){
		$.ajax({
			url : "/bank_format_emploee_id/",
			type : "POST",
			data : {'id':JSON.stringify(banking_employee_id_list),'from_date':from_date,'to_date':to_date,'payer_financial_institution':payer_financial_institution,'payer_name':payer_name,'payer_client_no':payer_client_no,'payment_type':payment_type,'payment_description':payment_description},
			async:false,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			console.log(json_data)
			if(data.success_data == 'Success'){
				alert_lobibox("success", "Report Generated Successfully")
				let path = '/media/payroll_bank_format/'+data.file_data[0].file_name + '.csv'
				var file_name = '<a  title="Download Offer" id="payroll_report_download" class="btn btn-success btn-eql-wid btn-animate" href="'
					+ path
					+ '" download="'
					+ data.file_data[0].file_name + '.csv'
					+ '"><i class="offer_report nf nf-download"></i></a>';
				$('#pdf_download').html(file_name);
				//alert_lobibox("success", "Payroll Report Generated Successfully. Please wait few seconds.");
				//setTimeout(function(){$('#payroll_report_download')[0].click(); }, 1000);
				$('#payroll_report_download')[0].click();
				banking_report_clear()
			}else{
				alert_lobibox("error", "Report Generated Failure");
			}
			//pdf_employee_data(data.employee_data)
		});
	}else{
		alert_lobibox("error", "Please Select An Employee");
	}

}

function all_banking_employee(employee_val){

	if (employee_val.checked == true){
		/*	$("#card_employee_id").select2({
	        dropdownParent: $("#select_employee")
	});*/
		//console.log("gtest",$('#banking_employee_id').length)
		$('#banking_employee_id').each(function () {
			 $("#banking_employee_id > option").prop("selected","selected");// Select All Options
		        $("#banking_employee_id").trigger("change");// Trigger change to select 2
			//$('#banking_employee_id option').attr("selected", true).trigger('change');
		});
		/*alert(0)
		$.ajax({	
			type  : 'POST',
			url   : '/select_all_employee/',
			async : false,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			console.log("NNNNNNNNNNNNN",data.employee_val)
			if(data){
				$('#banking_employee_id').val(data.employee_val).trigger('change')
			}else{
				alert_lobibox("error", "No Data Found");
			}
			
		});*/


	}else{
		$('#banking_employee_id').each(function () {
			//$("#banking_employee_id > option").prop("selected","selected");// Select All Options
	        //$("#banking_employee_id").trigger("change");// Trigger change to select 2
			$('#banking_employee_id option').attr("selected", false).trigger('change');
		});
		//$("#banking_employee_id").select2("refresh")
		//$("#banking_employee_id").select2('rebuild')
		$(".select2-search__field").attr('placeholder',"-- Select An Employee --");
		//	 $('#card_employee_id option').attr("selected", false).trigger('change');
//		$('#card_employee_id').val(0).trigger('change');
//		$("#banking_employee_id").select2({
//		    placeholder: "--Select An Employee--",
//		   // allowClear: true
//		});
	}
	//$('#select_employee option').prop('selected', true);
}

function dateFormatReport(val){
	return val.split(' ')[0]+'-'+val.split(' ')[1]
}

function banking_report_clear(){
	$("#banking_dtimepicker1").val('');
	$("#banking_dtimepicker2").val('');
	//$("banking_employee_id").val(0).trigger("change");
	//$(".select2").val(0).trigger('change');
	$('#banking_employee_id').val('').trigger('change');
	$("#select_employee").prop("checked", false);
	$("#payer_financial_institution").val('');
	$("#payer_name").val('');
	$("#payer_client_no").val('');
	$("#payment_type").val('').trigger('change');
	$("#payment_decription").val('');

}
//26-Mar-2018 || KAV || Correspondence Management - Entities - Initiation
var cd_entities_table;
var type,ent_table_id,ent_table_code,ent_table_status,ent_table_sub_category,ent_table_category,ent_table_name,ent_table_type;
var ent_table_category_id,ent_table_sub_category,ent_table_status,ent_table_type;
var type_list ,data_list_len;
var now_date = moment().format("DD-MMM-YYYY");
var sel_type;

//02-APR-2018 || SMI || Correspondence Management - Entities - Empty Datatable without buttons
function corrs_entities_tables_init(){
	cd_entities_table=$('#entities_table').DataTable({
		lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
		pageLength: 5,
		searching: false,
		lengthChange: false,
		language: {
			aria: {
				sortAscending: ": activate to sort column ascending",
				sortDescending: ": activate to sort column descending"
			},
			emptyTable: "No data available",
			info: "Showing _START_ to _END_ of _TOTAL_ entries",
			infoEmpty: "No entries found",
			infoFiltered: "(filtered1 from _MAX_ total entries)",
			lengthMenu: "_MENU_ entries",
			search: "",
			zeroRecords: "No matching records found"
		},
		columnDefs: [{
			"targets": [ 7 ],
			"visible": false,
			"searchable": false
		}],
	});
}

//03-APR-2018 || SMI || Correspondence Management - Entities - Dynamic buttons draw
function btn_forms(action_name){
	$("#btn_modal").html('');
	var btnstr = '';
	if (action_name == "add") { 
		btnstr += '<button type="button" class="btn btn-success animate_btn margin-right-3" onclick="cm_entity_save();" id="btn_entity_add">Save</button>';
		btnstr += '<button type="button" class="btn btn-warning animate_btn margin-right-3" onclick="modal_data_clear()">Cancel/Clear</button>';
	} else if (action_name == "update") {
		btnstr += '<button type="button" class="btn btn-success animate_btn margin-right-3" onclick="cm_entity_update();" id="btn_entity_update">Update</button>';
		btnstr += '<button type="button" class="btn btn-danger animate_btn margin-right-3" onclick="removeConfirmation(\''+"cm_entity_delete"+'\')" id="btn_modal_delete">Remove</button>';
		btnstr += '<button type="button" class="btn btn-warning animate_btn margin-right-3" onclick="modal_data_clear()">Cancel/Clear</button>';
	}
	$("#btn_modal").append(btnstr);
}

//26-Mar-2018 || KAV || Correspondence Management - Entities - Ready Function
$(document).ready(function(){
	$('#loading').css('display', 'none');
	corrs_entities_tables_init();
	$('#check_searchall').click(function() {
		if ($('#check_searchall').is(':checked')) {
			$('.mt-checkbox-list input[type=checkbox]').each(function() {
				$(this).prop("checked", true);
				var value=  $(this).val()
			});
		}
		else {
			$('.mt-checkbox-list input[type=checkbox]').each(function() {
				$(this).prop("checked", false); 
			});
		}
	});

	$('.cd_entity_types').click(function(){
		var checkbox_length= $('.cd_entity_types').length;
		var counter =0 ;
		for(i=0;i<checkbox_length;i++)
		{
			if($('.cd_entity_types:eq('+i+')').prop("checked") == true){
				counter++;
			}
			else if($('.cd_entity_types:eq('+i+')').prop("checked") == false){
				counter--;
			}
		}
		if(checkbox_length == counter)
		{
			$('#check_searchall').prop("checked", true);
		}
		else
		{
			$('#check_searchall').prop("checked", false);
		}
	});
	type_list=[];

	//28-Mar-2018 || KAV || Correspondence Management - Entities - Row Click Functionality
	$('#entities_table tbody').on('click', 'tr', function () {
		$('#loading').css('display', 'block');
		btn_forms("update");
		var cd_entities_table = $('#entities_table').DataTable();
		row_no = cd_entities_table.row(this).index();
		var data = cd_entities_table.row(this).data();
		ent_table_id  = data[7];
		$('#entity_add_new_modal').modal('show');
		$.ajax({
			url : "/entity_fetchdata_onclick/",
			type : "POST",
			data : {
				'id': ent_table_id,
			},
			timeout : 10000,
		}).done( function(json_data) {
			$('#loading').css('display', 'none');
			json_data = JSON.parse(json_data);
			var entity_name = $("#entity_name_modal").val(json_data['id'][0][0])
			var entity_code = $("#entity_code_modal").val(json_data['id'][0][1])
			$('#entity_category_val').val(json_data['id'][0][2]).trigger("change");
			$('#entity_status_modal').val(json_data['id'][0][3]).trigger("change");
			$('#entity_subcategory_modal').val(json_data['id'][0][4]).trigger("change");
			$('#entity_type_modal').val(json_data['id'][0][5]).trigger("change");
			if (json_data['id'][0][7] == 'IMAGE') {
				var src_data = json_data['id'][0][6]
				var res = src_data.split("/");
				var data = res[res.length-1]
				$("#dynamic_form").empty();
				$("#dynamic_form").append('<label class="control-label col-md-9">Image Upload </label><div class="col-md-9"> <div class="fileinput fileinput-exists" data-provides="fileinput"> <div class="fileinput-new thumbnail" style="width: 200px; height: 150px;"> <img src="http://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=no+image" alt=""> </div> <div class="fileinput-preview fileinput-exists thumbnail" id="type_image" name="type_image" style="max-width: 200px; max-height: 150px; line-height: 14px;"><img src='+src_data+' style="max-height: 136px;"></div> <div><span class="fileinput-filename">'+data+'</span></div> <div> <span class="btn green btn-file"> <span class="fileinput-new"> Select image </span> <span class="fileinput-exists"> Change </span> <input type="hidden" value="" name=""> <input type="file" name="type_img" aria-invalid="false" class="valid"> </span> <a href="javascript:;" class="btn red fileinput-exists" data-dismiss="fileinput"> Remove </a></div></div></div>');
			}
			if (json_data['id'][0][7] == 'LYOUT') {
				$("#type_layout").val(json_data['id'][0][6]);
			}
			if (json_data['id'][0][7] == 'TEXTT') {
				$("#type_text").val(json_data['id'][0][6]);
			}
		});
	});

	$('#entity_type_modal').on('change', function() {
		sel_type = $('#entity_type_modal').find('option:selected').text();
		vals = $('#entity_type_modal').find('option:selected').val();
		if (sel_type == 'Text'){
			$("#dynamic_form").empty();
			$("#dynamic_form").append('<label>Text</label><span class="required"> * </span><div class="input-icon margin-bottom-15"><i class="fa fa-user"></i> <input class="form-control" required="required" placeholder="Enter your text here..." id="type_text" name="type_text" type="text" data-error=".errorTxt6" /><span class="errorTxt6 error"></span> </div>');
		}
		else if (sel_type == 'Layout'){
			$("#dynamic_form").empty();
			$("#dynamic_form").append('<label>Layout</label><span class="required"> * </span> <textarea class="form-control" rows="3" id="type_layout" name="type_layout" placeholder="List your Layout" data-error=".errorTxt4"></textarea> <span class="errorTxt4 error"></span>');
		}
		else if (sel_type == 'Image'){
			$("#dynamic_form").empty();
			$("#dynamic_form").append('<label class="control-label col-md-9">Image Upload </label><div class="col-md-9"> <div class="fileinput fileinput-new" data-provides="fileinput"><div class="fileinput-new thumbnail" style="width: 200px; height: 150px;"> <img src="http://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=no+image" alt="" /> </div><div class="fileinput-preview fileinput-exists thumbnail" id="type_image" style="max-width: 200px; max-height: 150px;"> </div> <div><span class="fileinput-filename"></span></div> <div> <span class="btn green btn-file"> <span class="fileinput-new"> Select image </span> <span class="fileinput-exists"> Change </span><input type="file" name="type_img" data-error=".errorTxt7"> </span> <span class="errorTxt7 error"></span> <a href="javascript:;" class="btn red fileinput-exists" data-dismiss="fileinput"> Remove </a></div></div></div>');
		}
		else{
			$("#dynamic_form").empty();
		}
	});
});

//26-Mar-2018 || KAV || Correspondence Management - Entities - Add Button Click
$("#btn_add_new").click(function(){
	modal_data_clear();
	cm_entity_search_clear();
	$('#entity_add_new_modal').modal('show');
	btn_forms("add");
});

//26-Mar-2018 || KAV || Correspondence Management - Entities - Save Functionality
function cm_entity_save(){
	if (entity_form_validation()) {
		$('#loading').css('display', 'block');
		var entity_name = $("#entity_name_modal").val();
		var entity_code = $("#entity_code_modal").val();
		var category_val = $('#entity_category_val').find('option:selected').val();
		var sub_category_val = $('#entity_subcategory_modal').find('option:selected').val();
		var type_val = $('#entity_type_modal').find('option:selected').val();
		var status_val = $('#entity_status_modal').find('option:selected').val();
		if (sel_type == 'Text'){
			var type_text = $("#type_text").val();
			var img_name = '';
		}
		else if (sel_type == 'Layout'){
			var type_text = $("#type_layout").val();
			var img_name = '';
		}
		else if (sel_type == 'Image'){
			var type_text = $("#type_image img").attr('src');
			type_text = type_text.toString();
			var img_name = $(".fileinput-filename").text();
		}
		$.ajax({
			url : "/entity_add_data/",
			type : "POST",
			data : {
				'entity_name': entity_name,
				'entity_code': entity_code,
				'category_val': category_val,
				'sub_category_val': sub_category_val,
				'type_val': type_val,
				'status_val': status_val,
				'type_text': type_text,
				'img_name': img_name,
			},
			timeout : 10000,
		}).done( function(json_data) {
			$('#loading').css('display', 'none');
			json_data = JSON.parse(json_data);
			if(json_data.status == 'NTE_01'){
				alert_lobibox("success", sysparam_datas_list[json_data.status]);
				$('#entity_add_new_modal').modal('hide');
			} else {
				alert_lobibox("error", sysparam_datas_list[json_data.status]);
			}
		});
	}
};

//26-Mar-2018 || KAV || Correspondence Management - Entities - Modal Clear Functionality
function modal_data_clear(){
	$("#entity_name_modal").val('')
	$("#entity_code_modal").val('')
	$('#entity_category_val').val('0').trigger('change');
	$('#entity_subcategory_modal').val('0').trigger('change');
	$('#entity_type_modal').val('0').trigger('change');
	$('#entity_status_modal').val('0').trigger('change');
}

//27-Mar-2018 || KAV || Correspondence Management - Entities - Filter and Data Fetch script
function cm_entity_search(){
	var datas = getFormValues("#entity_form");
	type_list=[];
	$.each($("input[class='invisible cd_entity_types']:checked"), function(){ 
		type=($(this).val());
		type_list.push(type)
	});
	delete datas["check_searchall"];
	datas['entity_type_refitem_id'] = type_list
	if (datas.entity_name == '' && datas.entity_type_refitem_id.length == 0 && datas['entity_category_refitem_id'] == undefined && datas['entity_subcategory_refitem_id'] == undefined && datas['entity_status_refitem_id'] == undefined){
		alert_lobibox("warning", sysparam_datas_list["NTE_29"]);
	} else {
		$('#loading').css('display', 'block');
		$.ajax({
			url : "/entity_fetch_data/",
			type : "POST",
			data : {
				'datas': JSON.stringify(datas),
			},
			timeout : 10000,
		}).done( function(json_data) {
			$('#loading').css('display', 'none');
			json_data = JSON.parse(json_data);
			if(json_data['datas']){
				data_list_len = json_data['datas'].length;
				cd_entities_table=$('#entities_table').DataTable();
				cd_entities_table.clear().draw();
				$('#entities_table').DataTable().destroy();
				cd_entities_table = $('#entities_table').DataTable({
					autoWidth: false,
					language: {
						aria: {
							sortAscending: ": activate to sort column ascending",
							sortDescending: ": activate to sort column descending"
						},
						emptyTable: "No data available",
						info: "Showing _START_ to _END_ of _TOTAL_ entries",
						infoEmpty: "No entries found",
						infoFiltered: "(filtered1 from _MAX_ total entries)",
						lengthMenu: "_MENU_ entries",
						search: "Search:",
						zeroRecords: "No matching records found"
					},
					columnDefs: [{
						"targets": [ 7 ],
						"visible": false,
						"searchable": false
					}],
					buttons: [{
						extend: 'collection',
						className: "exporticon",
						filename:  'NTE_'+now_date+'_Corresspondence_Management_Entities',
						text: 'Export',
						exportOptions: {
							columns: ':visible'
						},
						buttons: [{
							extend: "pdf",
							className: 'pdficon',
							filename:  'NTE_'+now_date+'_Corresspondence_Management_Entities',
							messageTop: '<p><b>Role Details - Report</b></p>',
							messageBottom: 'Copyrights NEXT',
							customize: function(doc) {
								doc.styles.tableHeader.color = 'black';
								doc.styles.tableHeader.fillColor = '#ffffff';
								doc.content.splice( 1, 0, {
									margin: [ 0, 0, 0, 30 ],
									alignment: 'center',
									text: '',
								} );
								pageNumberPDF(doc, data_list_len)
							},
							exportOptions: {
								columns: ':visible'
							}
						},
						{
							extend: "excel",
							className: 'excelicon',
							filename:  'NTE_'+now_date+'_Corresspondence_Management_Entities',
							exportOptions: {
								columns: ':visible'
							},
							customize: function(xlsx) { pageHeaderExcel(xlsx) }
						}, {
							extend: "csv",
							className: 'csvicon',
							exportOptions: {
								columns: ':visible'
							},
							customize: function (csv) {
								return "My header NEXT Inc.\n\n NEXT Inc.\n"+  csv;
							}
						}],
					},{
						extend: "print",
						className: 'printicon',
						className: "btn blue",
						filename:  'NTE_'+now_date+'_Corresspondence_Management_Entities',
						title: '',
						messageTop: '<p><b>NTE_'+now_date+'_Corresspondence_Management_Entities</b></p>',
						exportOptions: {
							columns: ':visible'
						}
					}, {
						extend: "copy",
						className: "copyicon",
						filename:  'NTE_'+now_date+'_Corresspondence_Management_Entities',
						title: '',
						messageTop: '<p><b>NTE_'+now_date+'_Corresspondence_Management_Entities</b></p>',
						exportOptions: {
							columns: ':visible'
						}
					}, {
						extend: "colvis",
						className: "colvisicon",
						text: "Columns",
						columns: ':lt(7)'
					}],
					responsive: !0,
					order: [[0, "asc"]],
					lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
					pageLength: 5,
					dom: "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-6 col-sm-12'i><'col-md-6 col-sm-12'lp>>",
				});
				for(var i=0;i<json_data['datas'].length;i++) {
					cd_entities_table.row.add([i+1, json_data['datas'][i][2], json_data['datas'][i][1],
					                           json_data['datas'][i][3],
					                           json_data['datas'][i][4], json_data['datas'][i][5], json_data['datas'][i][6],json_data['datas'][i][0]]);
				}
				cd_entities_table.draw();
			}
			else
			{
				cd_entities_table=$('#entities_table').DataTable();
				cd_entities_table.clear().draw();
				$('#entities_table').DataTable().destroy();
				corrs_entities_tables_init();
				alert_lobibox("error", sysparam_datas_list["ERR0012"]);
			}
		});
	}
	return false;
};

//02-APR-2018 || KAV || Correspondence Management - Entities - Search Clear Functionality
function cm_entity_search_clear(){
	$('input:checkbox').removeAttr('checked');
	$("#entity_name").val('')
	$('#entity_category_refitem_id').val('0').trigger('change');
	$('#entity_subcategory_refitem_id').val('0').trigger('change');
	$('#entity_status_refitem_id').val('0').trigger('change');
	cd_entities_table=$('#entities_table').DataTable();
	cd_entities_table.clear().draw();
	$('#entities_table').DataTable().destroy();
	corrs_entities_tables_init();
}

//26-Mar-2018 || KAV || Correspondence Management - Entities - Update Functionality
function cm_entity_update(){
	if (entity_form_validation()){
		$('#loading').css('display', 'block');
		var entity_name = $("#entity_name_modal").val()
		var entity_code = $("#entity_code_modal").val()
		var category_val = $('#entity_category_val').find('option:selected').val();
		var sub_category_val = $('#entity_subcategory_modal').find('option:selected').val();
		var type_val = $('#entity_type_modal').find('option:selected').val();
		var status_val = $('#entity_status_modal').find('option:selected').val();
		var type_name = $('#entity_type_modal').find('option:selected').text();
		if (type_name == 'Text'){
			var type_text = $("#type_text").val();
			var img_name = '';
		}
		else if (type_name == 'Layout'){
			var type_text = $("#type_layout").val();
			var img_name = '';
		}
		else if (type_name == 'Image'){
			var type_text = $("#type_image img").attr('src');
			type_text = type_text.toString();
			var img_name = $(".fileinput-filename").text();
		}

		$.ajax({
			url : "/entity_update_data/",
			type : "POST",
			data : {
				'id':ent_table_id,
				'entity_name': entity_name,
				'entity_code':entity_code,
				'category_val':category_val,
				'sub_category_val':sub_category_val,
				'type_val':type_val,
				'status_val':status_val,
				'type_text':type_text,
				'img_name': img_name,
			},
			timeout : 10000,
		}).done( function(json_data) {
			$('#loading').css('display', 'none');
			json_data = JSON.parse(json_data);
			if(json_data.status == 'NTE_03'){
				modal_data_clear();
				cm_entity_search_clear();
				btn_forms("add");
				alert_lobibox("success", sysparam_datas_list[json_data.status]);
				$('#entity_add_new_modal').modal('hide');
			} else {
				alert_lobibox("error", sysparam_datas_list[json_data.status]);
			}
		}); 
	}
};

//26-Mar-2018 || KAV || Correspondence Management - Entities - Delete Functionality
function cm_entity_delete(){
	$('#loading').css('display', 'block');
	$.ajax({
		url : "/entity_delete_data/",
		type : "POST",
		data : {
			'id':ent_table_id,
			'is_active':'False',
		},
		timeout : 10000,
	}).done( function(json_data) {
		$('#loading').css('display', 'none');
		json_data = JSON.parse(json_data);
		if(json_data.status == 'NTE_04'){
			alert_lobibox("success", sysparam_datas_list[json_data.status]);
			modal_data_clear();
			cm_entity_search_clear();
			$('#entity_add_new_modal').modal('hide');
		} else {
			alert_lobibox("error", sysparam_datas_list[json_data.status]);
		}
	});
};

//Entity creation form validation
function entity_form_validation(){
	return $('#form_entity_add').valid();
}

$("#form_entity_add").validate({
	rules: {
		entity_name_modal:{
			required:true,
			noSpace: true,
			maxlength: 200
		},
		entity_code_modal:{
			required: true,
			noSpace: true,
			minlength: 5
		},
		entity_category_val:{
			valueNotEquals: true
		},
		entity_subcategory_modal:{
			valueNotEquals:true
		},
		entity_type_modal:{
			valueNotEquals: true
		},
		entity_status_modal:{
			valueNotEquals: true
		},
		type_text:{
			required:true,
			noSpace: true
		},
		type_layout:{
			required:true,
			noSpace: true
		},
		type_img:{
			required: true, 
			extension: "png|jpeg|jpg",
			filesize: 1048576
		},
	},
	//For custom messages
	messages: {
		entity_name_modal:{
			required:"Enter Entity Name",
		},
		entity_code_modal:{
			required:"Enter Entity Code",
		},
		entity_category_val:{
			valueNotEquals:"Select a Category",
		},
		entity_subcategory_modal:{
			valueNotEquals:"Select a Subcategory",
		},
		entity_type_modal:{
			valueNotEquals:"Select an Entity Type",
		},
		entity_status_modal:{
			valueNotEquals:"Select an Entity Status",
		},
		type_text:{
			required:"Enter Text For Type",
		},
		type_layout:{
			required:"List your layout",
		},
		type_img:{
			required:"Upload a valid image less than 1 MB",
		},
	},
	errorElement: 'div',
	errorPlacement: function(error, element) {
		var placement = $(element).data('error');
		if (placement) {
			$(placement).append(error);
		} else {
			error.insertAfter(element);
		}
	}
});

//16-MAR-2018 || KAV || Added function to print pdf with customization
function pageNumberPDF(doc, data_list_len){
	var newline = "\r\n"
		doc.content.splice(0,1);
	doc.pageMargins = [20,60,20,60];
	//Create a date string that we use in the footer. Format is dd-mm-yyyy
	var header_logo = 'data:image/*;base64,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';
	var logo = 'data:image/png;base64,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/GMzLdsAAERIaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzA2NyA3OS4xNTc3NDcsIDIwMTUvMDMvMzAtMjM6NDA6NDIgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiCiAgICAgICAgICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTUtMTAtMTVUMTQ6NTQ6MDIrMDU6MzA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDE4LTAxLTA1VDEyOjE0OjEzKzA1OjMwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxOC0wMS0wNVQxMjoxNDoxMyswNTozMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6MGRiNTUxYjgtMzBkMC02YTQyLTllMDAtZTQwODQzYTNhNTcxPC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6YzFiZTU2N2ItZTU4NC0xMWU3LWJkYWMtZjZhNTBlMjg1MTg5PC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6YzQ2ZjQyMWEtYWZhYi1lYjQ5LWE3NmItNmU2MmUxMzg3ZGI3PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmM0NmY0MjFhLWFmYWItZWI0OS1hNzZiLTZlNjJlMTM4N2RiNzwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNS0xMC0xNVQxNDo1NDowMiswNTozMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6ODA3NjRjMGMtZGMxNi05YTRjLTljOWItODI5NjE5NTk5ZGY5PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE1LTEwLTE1VDE1OjAwOjM4KzA1OjMwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDplMmQxMzE5Mi1mOTQ0LWI1NGMtYTAwNy1kZGE1OGE1ZGMzMTY8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTYtMDUtMjVUMTk6NDk6MjgrMDU6MzA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jb252ZXJ0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnBhcmFtZXRlcnM+ZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZzwvc3RFdnQ6cGFyYW1ldGVycz4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmRlcml2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnBhcmFtZXRlcnM+Y29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmc8L3N0RXZ0OnBhcmFtZXRlcnM+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjM5OWQ1NWI1LTZlMTctMTg0ZC04YTI1LTNmMGJjZDE4ZTk2YTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNi0wNS0yNVQxOTo0OToyOCswNTozMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MGRiNTUxYjgtMzBkMC02YTQyLTllMDAtZTQwODQzYTNhNTcxPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE4LTAxLTA1VDEyOjE0OjEzKzA1OjMwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHhtcE1NOkRlcml2ZWRGcm9tIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgPHN0UmVmOmluc3RhbmNlSUQ+eG1wLmlpZDplMmQxMzE5Mi1mOTQ0LWI1NGMtYTAwNy1kZGE1OGE1ZGMzMTY8L3N0UmVmOmluc3RhbmNlSUQ+CiAgICAgICAgICAgIDxzdFJlZjpkb2N1bWVudElEPnhtcC5kaWQ6YzQ2ZjQyMWEtYWZhYi1lYjQ5LWE3NmItNmU2MmUxMzg3ZGI3PC9zdFJlZjpkb2N1bWVudElEPgogICAgICAgICAgICA8c3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6YzQ2ZjQyMWEtYWZhYi1lYjQ5LWE3NmItNmU2MmUxMzg3ZGI3PC9zdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDwveG1wTU06RGVyaXZlZEZyb20+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDxwaG90b3Nob3A6SUNDUHJvZmlsZT5zUkdCIElFQzYxOTY2LTIuMTwvcGhvdG9zaG9wOklDQ1Byb2ZpbGU+CiAgICAgICAgIDxwaG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+CiAgICAgICAgICAgIDxyZGY6QmFnPgogICAgICAgICAgICAgICA8cmRmOmxpPjI3OTVCQ0Y1MjZBMEQ1ODI0MkVDRkI4MUM5QTEzMjA0PC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGk+eG1wLmRpZDo5MTI1N2VkYy00OTdjLTk0NDEtYWZhMS03NTVhODQxM2I2NzM8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaT54bXAuZGlkOmM0NmY0MjFhLWFmYWItZWI0OS1hNzZiLTZlNjJlMTM4N2RiNzwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpCYWc+CiAgICAgICAgIDwvcGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj42OTwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj42MDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+V0IgzQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAARu0lEQVR42uSbfaykVX3HP+ecZ95n7vsuLOCuhcKiWAEj2Koh9sVUTEwES2ippLFW/9CyuGBVRKJVY0w1sW1MaEzaGmMaggK7S3mzCIIUq5SXvQvsK8uy7y935869M3fuzDwvp3+c88yceeaZ+6Jla+okJ8/cyZ25z/nO7/f9fn+/37lCa83t9z/LUo8cIS0U/xi+lQUyQ38vIyEjICchKyGnoKSgYFcxXp55Pb7GzyselLze7xUUFKS55mTvc7P272QkKEAKEM59hJEm1Bo/Aj/StENNy652CG3nNT+CZhAxkZOXqdHCjze/wITHb+BD26sUEGk9eVYpc2e1FV73ibsOcKQW1eVvIijSALLWD7lzLJ+Zqbai6z75o2McqQYwnuM3JlJEnGaCqyLNpxq+vqaY85hphWx65AiHZwOYLADi/zcoAhACT8C7NVwXRFzTCvS6Wjsin/WotUNufuQwB6s+TBZBC5BnABTtXPWQn4etYZ+1xGME+G0JF4dwmYa3hxFXdCLKC4Gm4Wtm2xEjhQzVVsCmhw/x2owPUzEg0qC4ko1FCHJEVPBZ0BkQVIBrbXoGaQAstRm9zLebAoYAlAAPyAIFoCSg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';
	doc['header']=(function() {
		return {
			columns: [{
				alignment: 'left',
				image: header_logo,
				width:100,
				height:50,
				margin: [20, 0, 0, 0]
			},
			{
				alignment: 'center',
				fontSize: 16,
				text: 'NTE_'+now_date+'_Reports',
				margin: [0, 15, 20, 0]
			}
			],
		}
	});

	// Create a footer object with 2 columns
	// Left side: report creation date
	// Right side: current page and total pages
	doc['footer']=(function(page, pages) {
		return {
			columns: [{
				alignment: 'left',
				text: ['Results Returned: ', { text: data_list_len.toString()} ,    newline , 'Report Date: ', { text: now_date} ,    newline ,'Powered By NEXT Inc \u00a9 All Rights Reserved' ],
				margin: [ 10, 10, 0, 10 ],
			},
			{
				alignment: 'middle',
				text: ['Page ', { text: page.toString() },    ' of ',    { text: pages.toString() }],
				margin: [ 0, 33, 0, 0 ],
			},
			{
				alignment: 'right',
				image: logo,
				width:69,
				height:60
			}],
			margin: [ 0, 0, 0, 0 ]
		}
	});
	// Change dataTable layout (Table styling)
	// To use predefined layouts uncomment the line below and comment the custom lines below
	//doc.content[0].layout = 'lightHorizontalLines'; // noBorders , headerLineOnly
	var objLayout = {};
	objLayout['hLineWidth'] = function(i) { return .5; };
	objLayout['vLineWidth'] = function(i) { return .5; };
	objLayout['hLineColor'] = function(i) { return '#aaa'; };
	objLayout['vLineColor'] = function(i) { return '#aaa'; };
	objLayout['paddingLeft'] = function(i) { return 4; };
	objLayout['paddingRight'] = function(i) { return 4; };
	doc.content[0].layout = objLayout;
}

//Excel export with headers
function  pageHeaderExcel(xlsx) {
	var sheet = xlsx.xl.worksheets['sheet1.xml'];
	var downrows = 4;
	var clRow = $('row', sheet);
	var msg;
	//update Row
	clRow.each(function() {
		var attr = $(this).attr('r');
		var ind = parseInt(attr);
		ind = ind + downrows;
		$(this).attr("r", ind);
	});
	// Update  row > c
	$('row c ', sheet).each(function() {
		var attr = $(this).attr('r');
		var pre = attr.substring(0, 1);
		var ind = parseInt(attr.substring(1, attr.length));
		ind = ind + downrows;
		$(this).attr("r", pre + ind);
	});
	function Addrow(index, data) {
		msg = '<row r="' + index + '">';
		for (var i = 0; i < data.length; i++) {
			var key = data[i].k;
			var value = data[i].v;
			msg += '<c t="inlineStr" s="2"  r="' + key + index + '">';
			msg += '<is>';
			msg += '<t>' + value + '</t>';
			msg += '</is>';
			msg += '</c>';
		}
		msg += '</row>';
		return msg;
	}
	var r1 = Addrow(1, [{
		k: 'C',
		v: 'Entities Details'
	}]);
	var r2 = Addrow(2, [{
		k: 'A',
		v: 'Export Date :'
	}, {
		k: 'B',
		v:now_date
	}]);
	var r3 = Addrow(3, [{
		k: 'A',
		v: 'Company :'
	}, {
		k: 'B',
		v: 'NEXT Inc.'
	}]);
	var r4 = Addrow(4, [{
		k: 'A',
		v: 'Location :'
	}, {
		k: 'B',
		v: 'Coimbatore'
	}]);
	var r5 = Addrow(data_list_len+7,[{
		k: 'B',
		v: 'Total Number of Records'
	},{
		k: 'C',
		v: data_list_len
	}])
	sheet.childNodes[0].childNodes[1].innerHTML = r1 + r2 + r3 + sheet.childNodes[0].childNodes[1].innerHTML +r5; 
	// Loop over the cells in column `C`
	$('row c[r^="D"]', sheet).each( function () {
		// Get the value
		if ( $('is t', this).text() == 'cms@png.com' ) {
			$(this).attr( 's', '20' );
		}
	});
	var col = $('col', sheet);
	col.each(function () {
		$(this).attr('width', 15);
	});       
	$(col[0]).attr('width', 15);   
	$(col[1]).attr('width', 50);               
}
var columns = [{"title":"ID"}, {"title":"No."} ,{"title":"File Description"} ,{"title":"Status"}, {"title":"Uploaded By"}, {"title":"Uploaded On"} ];

global_upload_id=''
$(document).ready(function(){
        button_create(1);
	biometricAttendanceData();
    });
    
    //button create function here
    function button_create(status){
        var access_for_create = jQuery.inArray( "Manual Attendance", JSON.parse(localStorage.Create) );
        var access_for_write = jQuery.inArray( "Manual Attendance", JSON.parse(localStorage.Write) );
        var access_for_delete = jQuery.inArray( "Manual Attendance", JSON.parse(localStorage.Delete) );
        var strAppend = '';
        if(status == 1){
            if (access_for_create != -1){
                strAppend = "<button type='button' onclick='addUpdateAttendanceupload()' class='btn-animate btn-eql-wid  btn btn-success'>Add</button>"
            }
                strAppend += " <button type='button' onclick='clearAttendanceupload()'  class='btn-animate btn-eql-wid  btn btn-warning '>Cancel / Clear</button>"
            $('#hrms_matrix_attendance_btn').html(strAppend);
        }else{
        if (access_for_delete != -1){
                strAppend += " <button type='button' onclick='deleteAttendanceupload()' class='btn-animate btn-eql-wid  btn btn-danger '>Remove</button>"
            }
            strAppend += " <button type='button' onclick='clearAttendanceupload()' class='btn-animate btn-eql-wid  btn btn-warning '>Cancel / Clear</button>"
            $('#hrms_matrix_attendance_btn').html(strAppend);
        }
    }

    function addUpdateAttendanceupload()
    {
        file_description=$('#file_description').val()
        var form_datas = getFormValues("#hrms_matrix_attendance_form");
	    var csrf_data = form_datas.csrfmiddlewaretoken;
	    var datas = new FormData();
	    datas.append('csrfmiddlewaretoken', csrf_data);
	    datas.append('form_datas', JSON.stringify(form_datas));
	    var ext = $('#source_file').val().split('.').pop().toLowerCase();
	    if ($.inArray(ext, ['csv']) != -1) {
            datas.append('file-0', $("#source_file").get(0).files[0]);
            datas.append('existing_upload_id',global_upload_id);
            console.log(datas)
            $.ajax({
                type  : 'POST',
                url   : '/attendance_biometric_upload/',
                data  : datas,
                cache : false,
                contentType: false,
                processData: false,
                async:false,
            }).done( function(jsondata) {
                var data = JSON.parse(jsondata);
                if (data.status == "NTE_01") {
                    alert_lobibox("success", data.msg);
		    biometricAttendanceData();

                } else {
                    alert_lobibox("error", data.msg);
                }
            });
        }
	else{
	alert_lobibox("error", "Upload .csv format file");
	}
    }


function biometricAttendanceData(){
	$.ajax({
		url : "/attendance_upload_getall/",
		type : "GET",
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		console.log(data.data)
		plaindatatable_btn("matrix_attendance_upload_table",data.data,columns,0,'NEXT_TRANSFORM_HCMS_EMPLOYEE_BIOMETRIC_ATTENDANCE_'+currentDate());
	}); 
}

function clearAttendanceupload()
{
$("#hrms_matrix_attendance_form")[0].reset();
}

// $("#matrix_attendance_upload_table").on("click", "tr", function() { 
// 		if (!this.rowIndex) return; // skip first row
// 		id = $('#matrix_attendance_upload_table').dataTable().fnGetData(this)[0];

// 		matrix_data_load(id)
// 		dataTableAcitveRowAdd('matrix_attendance_upload_table',$(this).index());//active class add
// 		button_create(0)
// 	});
	
// function matrix_data_load(id)
// {
// var form_datas = getFormValues("#hrms_matrix_attendance_form");
// var csrf_data = form_datas.csrfmiddlewaretoken;
// $.ajax({
// 		url : "/attendance_upload_getbyid/",
// 		type : "POST",
// 		data :{'upload_id': id,'csrfmiddlewaretoken': csrf_data},
// 		timeout : 10000,
// 		async:false,
// 	}).done( function(json_data) {
// 		data = JSON.parse(json_data);
// 		console.log(data.data)
		
// 		})
// }

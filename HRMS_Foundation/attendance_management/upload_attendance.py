# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render
from django.conf import settings
import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse,HttpResponseServerError
from CommonLib import query
from django.db import connection
import config
from HRMS_Foundation.attendance_management.models import AttandanceInfo as AI
from CommonLib import query as q
from CommonLib.hcms_common import record_validation 
from HRMS_Foundation.employee_management.models import EmployeeInfo as EI
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
import logging
import logging.handlers
from CommonLib.hcms_common import refitem_fetch
from CommonLib.hcms_common import menu_access_control
logger_obj = logging.getLogger('logit')
import base64
import os
import csv
import datetime
from datetime import datetime
from django.core.files.storage import FileSystemStorage


@csrf_exempt
def attendance_biometric_upload(request):
    ''' 
    02-Nov-2022 JAN To HRMS Attendance page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: JAN
    '''
    json_data = {}
    cur = connection.cursor()
    uid = request.user.id
    if not uid:
        uid = 1
    if request.method == "POST":
            datas = request.POST.get('form_datas')
            if datas:
                datas = json.loads(datas)
            file_description=datas['file_description']
            file_data = request.FILES['file-0']
            file_path=settings.MEDIA_ROOT+"biometric_attendance/"
            print(file_description)
            print(file_data)
            cur.execute("""SELECT max(id) from biometric_attendance_upload""")
            latest_upload_id = cur.fetchone()
            print(latest_upload_id[0])
            if latest_upload_id[0] == None:
                latest_upload_id=0
            else:
                latest_upload_id=latest_upload_id[0]+1
            if file_data:
                file_name = "biometric_attendance_"+str(latest_upload_id)+".csv"
                with open(file_path+file_name, "wb") as fh:
                    fh.write(file_data.read().decode())
                cur.execute("""INSERT INTO public.biometric_attendance_upload(
                    file_description, file_location, file_name,status, is_active, created_date, modified_date, created_by_id, modified_by_id) 
                    VALUES ( %s, %s, %s, 'Processed',true, now(), now(), %s, %s) returning id""",(file_description,file_path,file_name,uid,uid,))
                upload_id = cur.fetchone()
                print(upload_id)
                if file_data:
                    csvreader = csv.reader(file_data)
                    for row in csvreader:
                        # print(row)
                        print(row[40])
                        if row[39]:
                            cur.execute('''select id,org_id_id,org_unit_id_id,team_name_id from employee_info where employee_id =  %s
                            ''',(str(row[40]),))
                            employee_detail=cur.fetchall()
                            if employee_detail:
                                # print(employee_detail)
                                punch_date=datetime.strptime(row[38], "%d/%m/%Y").date()
                                # print(punch_date)
                                start_time = datetime.strptime(row[43], '%H:%M').time()
                                end_time = datetime.strptime(row[45], '%H:%M').time()
                                start=datetime.combine(punch_date, start_time)
                                end=datetime.combine(punch_date, end_time)
                                # print(start,end)
                                total_hours = end-start
                                # print(total_hours)
                                cur.execute('''INSERT INTO public.attendance_info(created_date, modified_date, is_active, check_in, check_out, timesheet_id, entry_type, in_hrs, created_by_id, employee_id_id, 		modified_by_id, org_id_id, org_unit_id_id, org_team_id_id, attendance_type)
                    VALUES ( now(), now(), true, %s, %s, %s, false, %s, %s, %s, %s, %s, %s, %s, 'CSV')''',(start,end,upload_id[0],total_hours,1,employee_detail[0][0],1,employee_detail[0][1],employee_detail[0][2],employee_detail[0][3],))
                    
                    
                
                if upload_id:
                    json_data['msg'] = 'Report Uploaded. Will take some time to process attendance. Please Wait'
                    json_data['status'] = "NTE_01"
                else:
                    json_data['msg'] = 'Error Occured While Uploading'
                    json_data['status'] = "NTE_00"
    return HttpResponse(json.dumps(json_data))

def AttendanceUploadDataGetall(request):
    json_data={}
    try:
        if request.method == 'GET':
            cr = connection.cursor()
            cr.execute("""select ba.id,ROW_NUMBER () OVER (ORDER BY ba.id desc),ba.file_description,ba.status,concat(au.first_name,au.last_name) as uploaded_by, to_char(created_date,'YYYY-MM-DD') as uploaded_on,'Delete' as button  from biometric_attendance_upload ba
			left join auth_user au on ba.created_by_id=au.id where ba.is_active """)
            attendance_data = cr.fetchall()
            print("emppppp", attendance_data)
            if attendance_data:
                json_data['status'] = 1
                json_data['data'] = attendance_data
            else:
                json_data['status'] = 0
                json_data['data'] = []
                json_data['message'] = 'No Data Found'
        else:
            json_data['status'] = 0
            json_data['message'] = 'Error in Request'
        return HttpResponse(json.dumps(json_data))
    except Exception as e:
        json_data = e
        return HttpResponseServerError(json.dumps(json_data))

@csrf_exempt        
def AttendanceUploadDataGetById(request):
    json_data={}
    try:
        if request.method == 'POST':
            upload_id = request.POST.get('upload_id')
            cr = connection.cursor()
            cr.execute("""select ba.id,ba.file_description,ba.status,concat(au.first_name,au.last_name) as uploaded_by, to_char(created_date,'YYYY-MM-DD') as uploaded_onfrom biometric_attendance_upload ba
			left join auth_user au on ba.created_by_id=au.id where ba.is_active and ba.id={0} """.format(upload_id))
            attendance_data = q.dictfetchall(cr)
            print("emppppp", attendance_data)
            if attendance_data:
                json_data['status'] = 1
                json_data['data'] = attendance_data
            else:
                json_data['status'] = 0
                json_data['data'] = []
                json_data['message'] = 'No Data Found'
        else:
            json_data['status'] = 0
            json_data['message'] = 'Error in Request'
        return HttpResponse(json.dumps(json_data))
    except Exception as e:
        json_data = e
        return HttpResponseServerError(json.dumps(json_data))


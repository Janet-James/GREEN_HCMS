from django.shortcuts import render

import xlwt
import json
import datetime
import calendar
from time import strptime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib import query as q
from HRMS_Foundation.payroll_management.models import BankingPayer
from django_countries import countries
import config
from CommonLib.hcms_common import refitem_fetch
from CommonLib.hcms_common import menu_access_control
import HCMS.settings as setting
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import record_validation 
import logging
import logging.handlers
import inflect
v = inflect.engine()
logger_obj = logging.getLogger('logit')

class PayrollBankingPayer(TemplateView):
    ''' 
        06-July-2018 JAN To HR Payroll Payslip page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: JAN
    '''
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(PayrollBankingPayer, self).dispatch(request, *args, **kwargs)

    def get_template_names(self):
        macl = menu_access_control('Employee Report', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/payroll_management/banking_payer_form.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(PayrollBankingPayer, self).get_context_data(**kwargs)
        cur = connection.cursor() 
        cur.execute(q.fetch_hcms_query(config.payroll_management, config.hrms_select_organization_info));
        organization_data = q.dictfetchall(cur)  
        if organization_data:
            organization_data = organization_data
        else:
            organization_data = []  
        context[config.organization_info] = organization_data #Loading Organization Data
        cur.execute("""select DISTINCT emp.name as employee_name,emp.id from employee_info  emp
            inner join hr_salary_contract hrsc on hrsc.employee_id_id = emp.id
            where hrsc.is_active""")
        employee_data = q.dictfetchall(cur)  
        if employee_data:
            employee_data = employee_data
        else:
            employee_data = []  
        context['employee_val'] = employee_data #Loading Employee Data
        return self.render_to_response(context)

@csrf_exempt
def BankingPayerCreate(request): # employee details create function
    ''' 
    17-OCT-2018 JAN To HRMS Create Banking Payer function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: JAN
    '''
    #try:
    if request:
        logger_obj.info('Banking Payer details data insert by'+str(request.user.username))
        cur = connection.cursor() 
        json_data = {}
        data_value = request.POST.get(config.datas)   
        reg_id = request.POST.get(config.table_id) 
        delete_id = request.POST.get(config.delete_id)
        uid=request.user.id
        if not uid:
            uid = 1
        if data_value :
                data = json.loads(data_value)
		print"FFFFFFFFFFF",data['banking_payer_data'][0]['payer_account_type']
                if reg_id == '0': 
                            status = BankingPayer(organization_id=int(data['banking_payer_data'][0]['payer_company_id']), payer_description =data['banking_payer_data'][0]['payer_description'],payer_bank_code=data['banking_payer_data'][0]['payer_bank_code'], payer_branch_code=data['banking_payer_data'][0]['payer_branch_code'],
                                                  payer_account_type=data['banking_payer_data'][0]['payer_account_type'],payer_account_no=data['banking_payer_data'][0]['payer_account_number'], is_active="True",created_by_id = uid)
                            status.save()
                            json_data[config.status_id] = status.id
                            json_data[config.status_key] = config.success_status
                        
                else:
                    status = BankingPayer.objects.filter(id=reg_id).update(organization_id=int(data['banking_payer_data'][0]['payer_company_id']), payer_description =data['banking_payer_data'][0]['payer_description'],payer_bank_code=data['banking_payer_data'][0]['payer_bank_code'], payer_branch_code=data['banking_payer_data'][0]['payer_branch_code'],
                                                  payer_account_type=data['banking_payer_data'][0]['payer_account_type'],payer_account_no=data['banking_payer_data'][0]['payer_account_number'], is_active="True",modified_by_id=uid)
                    json_data[config.status_key] = config.update_status                                                           
                    logger_obj.info('Banking Payer details update response is'+str(json_data)+"attempted by"+str(request.user.username)) 
        else:
            referred_record = record_validation('payroll_banking_payer', delete_id)
            if referred_record == True:
                status =  BankingPayer.objects.filter(id=delete_id).update(is_active="False")
                json_data[config.status_key] = config.remove_status
            elif referred_record == False:
                json_data[config.status_key] = config.record_already_referred                          
    #except Exception as e:
     #       logger_obj.error(e)
      #      json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data)) 


@csrf_exempt
def HCMSBankingPayerTblDisplay(request):
    ''' 
    17-OCT-2018 VJY To HRMS Table Display Rating Point function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    try:
        json_data = {}
        logger_obj.info('Banking Payer details table display by'+str(request.user.username))
        if request.method == config.request_post:
            cur = connection.cursor() 
            cur.execute(q.fetch_hcms_query(config.payroll_management,config.banking_payer_table_display))
            table_data = q.dictfetchall(cur)
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e        
    return HttpResponse(json.dumps(table_data))  

@csrf_exempt
def HCMSBankingPayerRowClick(request):
    try:
        if request.method == config.request_get:
            cur = connection.cursor() 
            row_click_id = int(request.GET[config.id])
            if row_click_id:
                banking_payer_tbl_click = {}
                banking_payer_table_row_click = q.fetch_hcms_query(config.payroll_management,config.banking_payer_table_row_click)
                if banking_payer_table_row_click:
                    cur.execute(banking_payer_table_row_click%(row_click_id)) 
                    banking_payer_tbl_click = q.dictfetchall(cur)
    except Exception as e: 
            banking_payer_tbl_click = e
    return HttpResponse(json.dumps(banking_payer_tbl_click))

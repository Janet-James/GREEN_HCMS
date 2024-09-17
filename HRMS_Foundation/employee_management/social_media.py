 # -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from django.db import connection
from CommonLib import query as q
import config
from CommonLib.hcms_common import refitem_fetch
from CommonLib.hcms_common import menu_access_control
import HCMS.settings as settting
import pdfkit,os
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import record_validation 
import logging
import logging.handlers
import pdfkit
import datetime
logger_obj = logging.getLogger('logit')

# Meet Our Expertise views here
class websiteSocialMedia(TemplateView): # employee page
    ''' 
    22-Dec-2018 TRU to Employee Expertise loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(websiteSocialMedia, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Meet Our Expertise', self.request.user.id)
        if macl:
             template_name = "hrms_foundation/employee_management/social_media.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]    
        
   
    def get(self, request, *args, **kwargs):
        context = super(websiteSocialMedia, self).get_context_data(**kwargs)
        cur = connection.cursor()       
        cur.execute("select id,coalesce(name,'')||' '||coalesce(last_name,'') as name from employee_info where is_active order by name");
        employee_list = q.dictfetchall(cur)  
        context['employee_list'] = employee_list #Loading Employee Data     
        return self.render_to_response(context)

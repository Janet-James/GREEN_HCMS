

#!/usr/bin/python2.7
import psycopg2
import json
import datetime

class HCMSAuthUser():
    
    def __init__(self):
       # uid = request.user.id
        #if not uid:
        uid = 1
        self.uid = uid
    
    #defining auth user info    
    def run_auth_user_info(self):
        conn1=None
        try:
            print "-----------HCMS Auth User Details------------"
            conn1 = psycopg2.connect("dbname='green_hcms_live' user='next' host='localhost' password='next'")
            cur1 = conn1.cursor()
            cur1.execute('''select au.id as aid,au.password as apwd,au.is_superuser ais_superuser,au.username as ausername,au.first_name as afname
            ,au.last_name as alname,au.email as aemail,au.is_active as ais_active,ei.name as efname,ei.last_name as elname,
(ei.name||' '||ei.last_name) as ename,
            oi.name as oname,oui.orgunit_name as ouname,tdi.name as tname,coalesce(ai.name,'no_data.png') as image_name,
            oi.id as org_id,oui.id as org_unit_id,tdi.id as tid,ei.employee_id,coalesce((select related_user_id_id from employee_info
   where id = ei.parent_id::integer
            ),0) as parent_id ,coalesce(ei.role_id_id,0) as erole_id,
            coalesce((select RTRIM(refitems_name,'.') as name from reference_items where id=ei.title_id),'') as etitle,
            coalesce((select role_title as name from hcms_ti_role_details where id=ei.role_id_id),'') as erole_title,
            to_char(ei.date_of_joining,'yyyy-mm-dd') as joined_date,ei.id as eid,ei.date_of_birth,ei.image_id_id,ei.org_id_id,ei.org_unit_id_id,ei.team_name_id
            from auth_user au
            inner join employee_info ei
            on ei.related_user_id_id = au.id
            inner join organization_info oi
            on oi.id = ei.org_id_id
            inner join organization_unit_info oui
            on oui.id = ei.org_unit_id_id
            inner join team_details_info tdi
            on tdi.id = ei.team_name_id
            left join attachment_info ai 
            on ai.id = ei.image_id_id
            where au.id not in (2,171,22023) order by au.id
            ''')
            user_data = cur1.fetchall()
            print"______USERDATAAAAA______________",user_data
            if user_data:
                insert_status = self.db_data_insert_update('green_p5s_live', 'next', 'next', '10.0.1.5', user_data, 'P5S')
                if insert_status:
                    #insert_status = self.db_data_insert_update('Green_HR_02', 'next', 'next', '10.0.1.5', user_data, 'HCMS')
                    #if insert_status:
                     #   insert_status = self.db_data_insert_update('cses_test', 'next', 'next', '192.168.10.134', user_data, 'CSES')
                    if insert_status:
                            return True
                    else:
                            return False
                   # else:
                    #    return False
                else:
                    return False
            else:
                print "--Data is Empty--"
                return False
        except ValueError as err:
            print(err)
            return False
        finally:
            if conn1:
                conn1.close()
                
    def db_data_insert_update(self, *args):
       # try:
            print"DATAINSERT_--------------",args[5]
            conn = psycopg2.connect("dbname='{0}' user='{1}' password='{2}' host='{3}'".format(args[0], args[1], args[2], args[3]))
            cur = conn.cursor()
            print"-------------USER=========="
            for users in args[4]:
                if args[5] == "CSES":
                    cur.execute("select cses_auth_id from cses_hcms_user_rel where hcms_auth_id = %s",(int(self.uid),))
                    log_usr = cur.fetchall()
                    if log_usr:
                        log_usr = log_usr[0][0]
                    else:
                        log_usr = 1
                    #CSES auth user syn
                    #cur.execute("select cses_auth_id from cses_hcms_user_rel where hcms_auth_id = {0};".format(int(users[0])))
                    #user_exist = cur.fetchall()
                    #if user_exist:
                    #    cur.execute(""" UPDATE auth_user SET password=%s, username=%s, first_name=%s, 
                     #                       last_name=%s, email=%s, is_active=%s, date_joined=%s WHERE id = %s; """,
                      #                      (users[1],users[3],users[8],users[9],users[6],users[7],users[23],user_exist[0][0],))
                      #  cur.execute(""" UPDATE cses_hcms_user_rel SET modified_date=now(), is_active=%s, hcms_img=%s, modified_by_id=%s 
                       #                     WHERE cses_auth_id = %s; """,
                        #                   (users[7],users[14],log_usr,user_exist[0][0],))
                   # else:
                    #    cur.execute(""" INSERT INTO auth_user(password, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined)
                     #                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) returning id; """,
                     #                       (users[1],False,users[3],users[8],users[9],users[6],True,users[7],users[23],))
                     #   auth_user_insert_id = cur.fetchall()[0][0]
                     #   cur.execute(""" INSERT INTO cses_hcms_user_rel(created_date, modified_date, is_active, hcms_auth_id, hcms_img, 
                      #                      created_by_id, cses_auth_id, modified_by_id)
                       #                     VALUES (now(), now(), %s, %s, %s, 
                        #                    %s, %s, %s);  """,
                         #                   (users[7], users[0], users[14], 
  #                                           self.uid, auth_user_insert_id, self.uid, ))
                else:
                    #Npower auth user syn
                    cur.execute("select * from auth_user where id='{0}'".format(int(users[0])))
                    user_check_data = cur.fetchall()
                    if users[18] == '':
                        emp_id = 1
                    else:
                        emp_id = users[18]
                    if user_check_data:
                        print"UPPPPPPPDA"
                        if args[5] == "HCMS":
                            ######## Transform Data update
                            print"PPPPPPPPPPPPPPP",users[7]
                            update_str = """UPDATE auth_user SET  password = '{1}', is_superuser ={2} , username = '{3}' , first_name = '{4}',  last_name='{5}', email ='{6}', is_staff = {7}, is_active ={8},date_joined ='{9}' WHERE id={0};""".format(int(users[0]),str(users[1]),str(users[2]),str(users[3]),str(users[4]),
                                                str(users[5]),str(users[6]),False,users[7],str(users[23]))
                            #print update_str
                        else:
                            ######## P5S Data update
                            update_str = """UPDATE auth_user SET  password ='{1}', is_superuser='{2}', username ='{3}', first_name='{4}', 
    last_name='{5}', email='{6}', is_staff={7}, is_active={8}, employee_image='{9}', employee_name='{10}', 
    role_id={11}, team_name='{12}', title='{13}', matrix_id='{14}', attendence_violation_count={15}, parent_id={16},
     designation='{17}',date_joined='{18}',org_unit='{19}',org_unit_id='{20}',organization_name='{21}'   WHERE id={0};""".format(int(users[0]),str(users[1]),(users[2]),str(users[3]),str(users[4]), str(users[5]),str(users[6]),True,(users[7]),str(users[14]),
                                                    str(users[10]),int(users[20]),str(users[13]),str(users[21]),str(emp_id),int(0), int(users[19]),str(users[22]),str(users[23]),str(users[12]),str(users[16]),str(users[11]))
                        cur.execute(update_str)
                    else:
                        print"INSERTTTTTTTTTTTTT"
                        if args[5] == "HCMS":
                            ######## Transform Data insert
                            insert_str = ''' INSERT INTO auth_user( id, password, is_superuser, username, first_name,  last_name, email, is_staff, is_active,date_joined)VALUES ({0}, '{1}', {2}, '{3}', '{4}', '{5}', '{6}', {7}, {8},'{9}'); '''.format(int(users[0]),str(users[1]),str(users[2]),str(users[3]),str(users[4]),
                                                str(users[5]),str(users[6]),False,True,str(users[23]))
                        else:
                            ######## P5S Data insert
                            insert_str = '''INSERT INTO auth_user( id, password, is_superuser, username, first_name, last_name, email, is_staff, is_active, employee_image, 
                                                employee_name, role_id, team_name, title, matrix_id, attendence_violation_count, parent_id, designation,date_joined,org_unit,org_unit_id,organization_name)
                                                VALUES ({0}, '{1}', {2}, '{3}', '{4}', '{5}', '{6}', {7}, {8}, '{9}', '{10}', {11}, '{12}', '{13}', '{14}', {15}, {16}, '{17}','{18}','{19}','{20}','{21}');
                                                '''.format(int(users[0]),str(users[1]),(users[2]),str(users[3]),str(users[4]), str(users[5]),str(users[6]),True,(users[7]),str(users[14]),
                                                    str(users[10]),int(users[20]),str(users[13]),str(users[21]),str(emp_id),int(0), int(users[19]),str(users[22]),str(users[23]),str(users[12]),str(users[16]),str(users[11]))
                        cur.execute(insert_str)
                    if args[5] == "HCMS":
                            ### Transform updates
                            cur.execute("select * from hr_employee where id='{0}'".format(int(users[24])))
                            emp_check_data_trans = cur.fetchall()
                            #print 'emp_check_data_trans',emp_check_data_trans
                            print"EEEEEEEEEEE",users[27],users[28]
                            if emp_check_data_trans:
                                cur.execute('''
                                    update hr_employee set
                                    name=  '{1}', work_email ='{2}',date_of_birth='{3}', 
                                    image_name ='{4}', company_id_id = 1, department_id_id = {6}, team_id_id = 1,is_active = {8},matrix_id = {11},created_by = 1,modified_by = 1,created_date ='{9}',modified_date = '{9}',related_user_id ={10} where id = {0}
                                '''.format(int(users[24]),str(users[10]),str(users[6]),str(users[25]),users[14],
                                int(users[28]),int(users[27]),int(users[29]),users[7],(datetime.datetime.today().strftime('%Y-%m-%d')),int(users[0]),int(emp_id),(users[29])))
                            else:
                                print"$$$$$$$$$$$$$$$$$$",users[25]
                                cur.execute('''
                                    INSERT INTO hr_employee(
                                    id, name, work_email,date_of_birth, 
                                    image_name, company_id_id, department_id_id, team_id_id,is_active,matrix_id,created_by,modified_by,created_date,modified_date,related_user_id)
                                    VALUES ({0}, '{1}', '{2}', '{3}',  
                                    '{4}', 1, {6}, 1, {8},{11},1,1,'{9}','{9}',{10});
                                '''.format(int(users[24]),str(users[10]),str(users[6]),str(users[25]),users[14],
                                int(users[27]),int(users[27]),int(users[29]),True,(datetime.datetime.today().strftime('%Y-%m-%d')),int(users[0]),int(emp_id),int(users[29])))
                conn.commit()
            conn.close()
            return True
        #except Exception as err:
         #   print(err)
          #  return False

if __name__ == '__main__':
    r1 = HCMSAuthUser()
    r1.run_auth_user_info()
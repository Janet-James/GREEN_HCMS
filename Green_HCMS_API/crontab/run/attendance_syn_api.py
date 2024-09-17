import csv
import psycopg2
import datetime
from datetime import datetime

class biometricAttendanceAPI():
     def run_biometric_attendance_api(self):
        try:
            conn = psycopg2.connect("dbname='green_hcms_live' user='next' host='localhost' password='next'")
            cur = conn.cursor()
            cur.execute('''select id,file_location,file_name from biometric_attendance_upload where status='Not Yet Processed' and is_active''')
            matrix_detail=cur.fetchall()
            if matrix_detail:
                for i in matrix_detail:
                    print(i)
                    print(i[0],i[1])
                    with open(i[1]+i[2], 'r') as file:
                        csvreader = csv.reader(file)
                        for row in csvreader:
                            # print(row)
                            # print(row[43],row[45])
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
                        VALUES ( now(), now(), true, %s, %s, %s, false, %s, %s, %s, %s, %s, %s, %s, 'CSV')''',(start,end,i[0],total_hours,1,employee_detail[0][0],1,employee_detail[0][1],employee_detail[0][2],employee_detail[0][3],))
                        cur.execute("""UPDATE biometric_attendance_upload set status='Processed' where id = {0}""".format(i[0]))
			conn.commit()

            else:
                print("No File to Process")
        except ValueError as test:
            print(test)
        finally:
            conn.close()

if __name__ == '__main__':
   r1 = biometricAttendanceAPI()
   r1.run_biometric_attendance_api()
   print "Opened database successfully"



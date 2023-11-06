from app.config_db import get_db_connection
from flask_restful import Resource
from flask import request
from app.config_flask import SECRET_KEY
import jwt

def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

class MyReport(Resource):
    def get(self):
        db, lmd = get_db_connection()
        
        token = request.headers.get('Authorization')
        if not token:
            return {'message': 'Token is missing'}, 401

        payload = verify_token(token)

        if payload:
            email = payload['email']
            password = payload['password']
            if email and password:
                
                lmd.execute('SELECT * from ticket where email = %s', (email,))
                loandata = lmd.fetchall()
                lmd.execute('SELECT count(*) from loandata where email = %s and status = %s', (email, 0))
                onloan = lmd.fetchone()[0]
                
                lmd.execute('SELECT count(*) from ticket where email = %s and status = %s', (email, 0))
                onrequest = lmd.fetchone()[0]
                
                myreport_list = []
                for row, row_data in enumerate(loandata, start=1):
                    idticket, idasset, username, leasedate, returndate, locationasset, emailuser, note, statusticket = row_data

                    # Asset Information
                    lmd.execute('SELECT * from assets where id = %s', (idasset,))
                    assetinformation = lmd.fetchone()

                    lmd.execute('SELECT email,status from ticketingadmin where idticket = %s', (idticket,))
                    email_admin = lmd.fetchall() 
                    
                    username_admin1 = username_admin2 = None
                    admin1_status = admin2_status = None

                    if email_admin:
                        lmd.execute('SELECT username from users where email = %s', (email_admin[0][0],))
                        username_admin1 = lmd.fetchone()
                        admin1_status = email_admin[0][1]
                        if len(email_admin) > 1:
                            lmd.execute('SELECT username from users where email = %s', (email_admin[1][0],))
                            username_admin2 = lmd.fetchone()
                            admin2_status = email_admin[1][1]

                    if admin1_status == 1:
                        admin1_status = 'Approved'
                    elif admin1_status == 2:
                        admin1_status = 'Decline'
                    else:
                        admin1_status = 'on Request'
                        
                    if admin2_status == 1:
                        admin2_status = 'Approved'
                    elif admin2_status == 2 and admin1_status == 1:
                        admin2_status = 'Decline'
                    elif admin2_status == 2:
                        admin2_status = 'on Request'
                    else:
                        admin2_status = 'on Request'
                    

                    if statusticket == 1:
                        statusticket = 'Approved'
                    elif statusticket == 2:
                        statusticket = 'Decline'
                    else:
                        statusticket = 'on Request'

                    # Ticket Checking
                    
                    lmd.execute('SELECT * from loandata where email = %s and deleted = %s AND idticket = %s', (email, 0, idticket))
                    loandatas = lmd.fetchone()
                    
                    if loandatas:
                        # Create a dictionary for each ticket and add it to the list
                        loan_data = {
                            'no': row,
                            'id': loandatas[0],
                            'idticket': idticket,
                            'idasset': idasset,
                            'name': loandatas[6],
                            'leasedate': str(leasedate),
                            'returndate': str(returndate),
                            'email': email,
                            'statusticket': statusticket,
                            'asset': assetinformation[1],
                            'assetname': assetinformation[2],
                            'assetdescription': assetinformation[3],
                            'assetbrand': assetinformation[4],
                            'assetmodel': assetinformation[5],
                            'assetstatus': assetinformation[6],
                            'assetlocation': assetinformation[7],
                            'assetcategory': assetinformation[8],
                            'assetsn': assetinformation[9],
                            'assetphoto': assetinformation[10],
                            'admin1': username_admin1[0] if username_admin1 else None,
                            'admin2': username_admin2[0] if username_admin2 else None,
                            'admin1status': admin1_status,
                            'admin2status': admin2_status,
                        }
                        myreport_list.append(loan_data)
                    if statusticket == 'Decline':
                        # Create a dictionary for each ticket and add it to the list
                        loan_data = {
                            'no': row,
                            'idticket': idticket,
                            'idasset': idasset,
                            'leasedate': str(leasedate),
                            'returndate': str(returndate),
                            'email': email,
                            'statusticket': statusticket,
                            'asset': assetinformation[1],
                            'assetname': assetinformation[2],
                            'assetdescription': assetinformation[3],
                            'assetbrand': assetinformation[4],
                            'assetmodel': assetinformation[5],
                            'assetstatus': assetinformation[6],
                            'assetlocation': assetinformation[7],
                            'assetcategory': assetinformation[8],
                            'assetsn': assetinformation[9],
                            'assetphoto': assetinformation[10],
                            'admin1': username_admin1[0] if username_admin1 else None,
                            'admin2': username_admin2[0] if username_admin2 else None,
                            'admin1status': admin1_status,
                            'admin2status': admin2_status,
                        }
                        myreport_list.append(loan_data)
                response_data = {
                    'myreport_list': myreport_list,
                    'onloan': onloan,
                    'onrequest': onrequest
                }

                return response_data, 200

class MyReportDelete(Resource):
    def put(self, selectedMyReportID):
        db, lmd = get_db_connection()
        
        token = request.headers.get('Authorization')
        if not token:
            return {'message': 'Token is missing'}, 401

        payload = verify_token(token)

        if payload:
            email = payload['email']
            password = payload['password']
            if email and password:
                lmd.execute('UPDATE loandata set deleted = %s where id = %s and email = %s', ('1', selectedMyReportID, email))
                db.commit()
                
                return {'message': 'Successfuly Deleted'}
            else:
                return {'message': 'Email Password Not Found'}
        else:
            return {'message': 'Token Invalid'}

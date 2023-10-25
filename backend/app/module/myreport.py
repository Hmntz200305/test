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
    
                # Ticket Checking
                lmd.execute('SELECT * from loandata where status = %s and email = %s', (0, email))
                loandata = lmd.fetchall()

                myreport_list = []
                for row, row_data in enumerate(loandata, start=1):
                    idloandata, idticket, idasset, nameasset, leasedate, returndate, username, email, status = row_data

                    if status == 0:
                        status = 'In Loans'
                    else:
                        status = '...'

                    # Asset Information
                    lmd.execute('SELECT * from assets where id = %s', (idasset,))
                    assetinformation = lmd.fetchone()

                    lmd.execute('SELECT email from ticketingadmin where idticket = %s', (idticket,))
                    email_admin = lmd.fetchall() 

                    username_admin1 = username_admin2 = None  # Inisialisasi variabel

                    if email_admin:
                        lmd.execute('SELECT username from users where email = %s', (email_admin[0][0],))
                        username_admin1 = lmd.fetchone()
                        if len(email_admin) > 1:
                            lmd.execute('SELECT username from users where email = %s', (email_admin[1][0],))
                            username_admin2 = lmd.fetchone()

                    lmd.execute('SELECT status from ticket where idticket = %s', (idticket,))
                    statusticket = lmd.fetchone()[0]

                    if statusticket == 1:
                        statusticket = 'Approved'
                    elif statusticket == 2:
                        statusticket = 'Decline'
                    else:
                        statusticket = 'on Request'


                    # Create a dictionary for each ticket and add it to the list
                    loan_data = {
                        'no': row,  # Menambahkan nomor baris
                        'idticket': idticket,
                        'idasset': idasset,
                        'name': username,
                        'leasedate': str(leasedate),
                        'returndate': str(returndate),
                        'email': email,
                        'status': status,
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
                        'statusticket': statusticket,
                    }
                    myreport_list.append(loan_data)

                return myreport_list, 200

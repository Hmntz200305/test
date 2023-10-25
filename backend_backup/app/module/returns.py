from app.config_db import get_db_connection
from app.config_flask import SECRET_KEY
from flask_restful import Resource
from flask import request
import jwt

def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

class inLoanAssetList(Resource):
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
                lmd.execute('SELECT username from users where email = %s', (email,))
                username = lmd.fetchone()[0]
                lmd.execute('SELECT id, idasset, nameasset, leasedate, returndate FROM loandata WHERE username = %s AND email = %s and status = %s', (username, email, 0,))
                inloandata = lmd.fetchall()
                
                lmd.execute("SELECT count(*) from loandata where email = %s and status = %s", (email, '0',))
                loancount = lmd.fetchone()[0]
                
                if inloandata:
                    data = []

                    for index, row in enumerate(inloandata, start=1):
                        idloandata = row[0]
                        idasset = row[1]
                        nameasset = row[2]
                        leasedate = row[3]
                        returndate = row[4]
                        leasedate_str = leasedate.isoformat()
                        returndate_str = returndate.isoformat()
                        lmd.execute('SELECT asset from assets where id = %s', (idasset,))
                        idassets = lmd.fetchone()[0]
                        data.append({'row': index, 'id': idloandata, 'idasset': idassets, 'nameasset': nameasset, 'leasedate': leasedate_str, 'returndate': returndate_str})
                
                    return {'data': data, 'loancount': loancount}
                else:
                    return {'message': 'Tidak ada data peminjaman yang ditemukan.', 'loancount': loancount}


class ReturnAsset(Resource):
    def post(self, selectedLoanID):
        db,lmd = get_db_connection()
        
        token = request.headers.get('Authorization')
        if not token:
            return {'message': 'Token is missing'}, 401

        payload = verify_token(token)

        if payload:
            email = payload['email']
            password = payload['password']
            if email and password:
                lmd.execute('UPDATE loandata set status = %s where id = %s and email = %s', (1, selectedLoanID, email,))
                db.commit()
                lmd.execute('SELECT idasset from loandata where id = %s', (selectedLoanID,))
                idasset = lmd.fetchone()[0]
                lmd.execute('UPDATE assets set status = %s where id = %s', ('Available', idasset,))
                db.commit()
                
                return {'message': f'Barang dengan id {idasset} sudah dikembalikan'}
        
from app.config_db import get_db_connection
from flask_restful import Resource
from flask import request, jsonify
from app.config_flask import SECRET_KEY
import jwt
import os

def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def validate_lease(ids, name, leasedate, returndate, location, email, note, admin1, admin2):
    if not ids or not name or not leasedate or not returndate or not location or not email or not note or not admin1 or not admin2:
        return False
    return True

class LeaseTicket(Resource):
    def post(self):
        db, lmd = get_db_connection()
        
        token = request.headers.get('Authorization')
        if not token:
            return {'message': 'Token is missing'}, 401
        
        payload = verify_token(token)
        
        if payload:
            email = payload['email']
            password = payload['password']
            if email and password:
                data = request.form 
                ids = data.get('AssetID')
                name = data.get('Name')
                leasedate = data.get('CheckoutDate')
                returndate = data.get('CheckinDate')
                location = data.get('Location')
                email = data.get('Email')
                note = data.get('Note')
                admin1 = data.get('Admin1')
                admin2 = data.get('Admin2')
                
                if not validate_lease(ids, name, leasedate, returndate, location, email, note, admin1 ,admin2):
                    return {"message": "Data is incomplete"}, 400
                if data:
                    lmd.execute('INSERT INTO ticket (idasset, name, leasedate, returndate, location, email, note, status) VALUES (%s, %s ,%s, %s, %s, %s, %s, %s)', (ids, name, leasedate, returndate, location, email, note, 0))
                    db.commit()
                    
                    lmd.execute('UPDATE assets set status = %s where id = %s', ('on Request', ids))
                    db.commit()
                    
                    lmd.execute('SELECT LAST_INSERT_ID()')
                    idticket = lmd.fetchone()[0]

                    lmd.execute('INSERT INTO ticketingadmin (idticket, email, status) values (%s, %s, %s)', (idticket, admin1, 0))
                    db.commit()
                    lmd.execute('INSERT INTO ticketingadmin (idticket, email, status) values (%s, %s, %s)', (idticket, admin2, 0))
                    db.commit()
                    
                lmd.close()
                db.close()
                return {"message": "Lease successfully Send"}, 200
            else:
                return {"message": "You don't have access to run this command"}, 403


class LeaseSubmited(Resource):
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
                lmd.execute('SELECT * from ticketingadmin where email = %s', (email,))
                cekadmin = lmd.fetchall()

                ticketingadmin_list = []
                for row in cekadmin:
                    ids, idticket, username, status = row
                    ticketingadmin_list.append({
                        'id': ids,
                        'idticket': idticket,
                        'username': username,
                        'status': status
                    })

                ticket_list = []

                idtickets = [admin_row['idticket'] for admin_row in ticketingadmin_list]
                placeholders = ', '.join(['%s'] * len(idtickets))
                query = 'SELECT * FROM ticket ' \
                        'INNER JOIN ticketingadmin ON ticket.idticket = ticketingadmin.idticket ' \
                        'INNER JOIN assets ON ticket.idasset = assets.id ' \
                        'WHERE ticket.idticket IN ({}) AND ticket.status = 0 AND ticketingadmin.status = 0 AND ticketingadmin.email = %s'.format(placeholders)

                params = idtickets + [email]
                lmd.execute(query, params)
                cekticket = lmd.fetchall()

                for data in cekticket:
                    idtickets, idasset, name, leasedate, returndate, location, email, note, status, idticketingadmin, idticketadmin, admin_email, admin_status, idassets, assets, assetname, assetdesc, assetbrand, assetmodel, assetstatus, assetlocation, assetcategory, assetsn, assetphoto, assetcreated = data
                    ticket_list.append({
                        'idticket': idtickets,
                        'idasset': idasset,
                        'name': name,
                        'leasedate': leasedate,
                        'returndate': returndate,
                        'location': location,
                        'email': email,
                        'note': note,
                        'status': status,
                        'idticketingadmin': idticketingadmin,
                        'idticketadmin': idticketadmin,
                        'admin_email': admin_email,
                        'admin_status': admin_status,
                        'idassets': idassets,
                        'assets': assets,
                        'assetname': assetname,
                        'assetdesc': assetdesc,
                        'assetbrand': assetbrand,
                        'assetmodel': assetmodel,
                        'assetstatus': assetstatus,
                        'assetlocation': assetlocation,
                        'assetcategory': assetcategory,
                        'assetsn': assetsn,
                        'assetphoto': assetphoto,
                        'assetcreated': assetcreated
                    })

                lmd.close()

        return jsonify(ticket_list)

class TicketApprove(Resource):
    def put(self, selectedTicketId):
        db, lmd = get_db_connection()
        
        token = request.headers.get('Authorization')
        if not token:
            return {'message': 'Token is missing'}, 401

        payload = verify_token(token)

        if payload:
            email = payload['email']
            password = payload['password']
            if email and password:
                if selectedTicketId:
                    data = request.form
                    SelectedTicketingAdmin = data.get('SelectedTicketingAdmin')
                    if data:
                        TicketID = selectedTicketId
                        lmd.execute('SELECT idasset,leasedate,returndate,name,email from ticket where idticket = %s', (TicketID,))
                        data = lmd.fetchone()
                        lmd.execute('SELECT email,status from ticketingadmin where idticket= %s and email = %s', (SelectedTicketingAdmin, email,))
                        fetch_ticketingadmin = lmd.fetchone()
                        ticketingadmin_email, ticketingadmin_status = fetch_ticketingadmin
                        lmd.execute('SELECT email,status from ticketingadmin where idticket= %s and email != %s', (SelectedTicketingAdmin, email,))
                        fetch_ticketingadmin_2 = lmd.fetchone()
                        ticketingadmin_email_2, ticketingadmin_status_2 = fetch_ticketingadmin_2
                        if ticketingadmin_email == email:
                            lmd.execute('UPDATE ticketingadmin set status = %s where idticket = %s and email = %s', ('1', SelectedTicketingAdmin, email))
                            db.commit()
                            if ticketingadmin_email_2 != email and ticketingadmin_status_2 == 1:
                                lmd.execute('UPDATE ticket set status = %s where idticket = %s', ('1', TicketID))
                                db.commit()
                                lmd.execute('UPDATE assets set status = %s where id = %s', ('in Loans', data[0]))
                                db.commit()
                                lmd.execute('SELECT name from assets where id = %s', (data[0],))
                                nameasset = lmd.fetchone()[0]
                                lmd.execute('INSERT INTO loandata (idasset, nameasset, leasedate, returndate, username, email, status) VALUES (%s, %s, %s ,%s ,%s, %s ,%s)', (data[0], nameasset, data[1], data[2], data[3], data[4], '0'))
                                db.commit()
                        lmd.close()
                        db.close()          
                        return {'message': f'TicketID  {TicketID} Approved'}
                    else:
                        return {'message': 'Data Invalid'}
                else:
                    return {'message': 'Ticket Invalid'}

class TicketDecline(Resource):
    def put(self, selectedTicketId):
        db, lmd = get_db_connection()
        
        token = request.headers.get('Authorization')
        if not token:
            return {'message': 'Token is missing'}, 401

        payload = verify_token(token)

        if payload:
            email = payload['email']
            password = payload['password']
            if email and password:
                if selectedTicketId:
                    TicketID = selectedTicketId
                    lmd.execute('SELECT idasset from ticket where idticket = %s', (TicketID,))
                    fetch_ticket = lmd.fetchone()[0]
                    lmd.execute('UPDATE ticket set status = %s where idticket = %s', ('2', TicketID))
                    db.commit()
                    lmd.execute('UPDATE ticketingadmin set status = %s where idticket = %s', ('2', TicketID))
                    db.commit()
                    lmd.execute('UPDATE assets set status = %s where id = %s', ('Available', fetch_ticket))
                    db.commit()
                    lmd.close()
                    db.close()          
                    
                    return {'message': f'TicketID  {TicketID} has decline'}
                else:
                    return {'message': 'Ticket Invalid'}
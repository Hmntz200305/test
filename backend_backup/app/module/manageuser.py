from flask import Flask, jsonify, request, session, jsonify
from app.config_flask import SECRET_KEY
from app.config_db import get_db_connection
from flask_restful import Resource, reqparse
import hashlib
import jwt
import json


def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def validate_register(username, email, password, roles):
    return True

class Register(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str, required=True)
        parser.add_argument('email', type=str, required=True)
        parser.add_argument('password', type=str, required=True)
        parser.add_argument('roles', type=int, required=True)
        args = parser.parse_args()
        
        username = args['username']
        email = args['email']
        password = args['password']
        roles = args['roles']
        
        token = request.headers.get('Authorization')
        if not token:
            return {'message': 'Token is missing'}, 401
        
        payload = verify_token(token)
        if payload:
            email_executor = payload['email']
            password_executor = payload['password']
            if email_executor and password_executor:
                db, lmd = get_db_connection()
                lmd.execute("SELECT role from users where email = %s and password = %s", (email_executor, password_executor))
                fetch = lmd.fetchone()[0]
                if fetch == 2:
                    if validate_register(username, email, password, roles):
                        md5 = hashlib.md5(password.encode())
                        md5password = md5.hexdigest()

                        lmd.execute("SELECT count(*) from users where email = %s", (email,))
                        cek = lmd.fetchone()[0]
                        if cek == 0:
                            lmd.execute("INSERT INTO users (username, email, password, role) VALUES (%s, %s, %s, %s)", (username, email, md5password, roles))
                            db.commit()
                            lmd.close()
                            return {"message": "Accounts Registration Success"}
                        else:
                            return {"message": "Accounts already exists"}
                    else:
                        return {"message": "Format Wrong"}
                else:
                    return {"message": "unauthorized"}
        else:
            return {"message": "Token Invalid"}
        
class ManageUser(Resource):
    def get(self):
        db, lmd = get_db_connection()
        lmd.execute("SELECT * FROM users")
        data = lmd.fetchall()
        lmd.close()
        formatted_data = []
        
        for item in data:
            if item[4] == 2:
                role = 'Super Admin'
            elif item[4] == 1:
                role = 'Admin'
            else:
                role = 'User'
                
            formatted_data.append({
                'no': item[0],
                'username': item[1],
                'email': item[2],
                'role': role,
                'created_at': item[5].strftime("%Y-%m-%d %H:%M:%S")
            })
        
        return jsonify(formatted_data)
    
class DeleteUser(Resource):
    def delete(self, no):
        db, lmd = get_db_connection()
        
        lmd.execute("SELECT email FROM users WHERE id = %s", (no,))
        existing_user = lmd.fetchone()
        
        if existing_user:
            lmd.execute("DELETE FROM users WHERE id = %s", (no,))
            db.commit()
            lmd.close()
            return {'message': "User with ID {} has been deleted.".format(no)}, 200
        else:
            lmd.close()
            return {'message': "User with ID {} not found.".format(no)}, 404
        
class EditUser(Resource):
    def put(self, no):
        db, lmd = get_db_connection()

        token = request.headers.get('Authorization')
        if not token:
            return {'message': 'Token is missing'}, 401
        
        payload = verify_token(token)
        if payload:
            email_executor = payload['email']
            password_executor = payload['password']
            if email_executor and password_executor:
                lmd.execute("SELECT role from users where email = %s and password = %s", (email_executor, password_executor))
                fetch = lmd.fetchone()[0]
                if fetch == 2:
                    lmd.execute("SELECT * FROM users WHERE id = %s", (no,))
                    existing_asset = lmd.fetchone()
                    
                    if existing_asset:
                        data = request.get_json()
                        
                        print(data)
                        print(data.get('username'))
                        print(data.get('userrole'))
                        lmd.execute(
                            """
                            UPDATE users
                            SET username = %s, role = %s
                            WHERE id = %s
                            """,
                            (
                                data.get("username"),
                                data.get("userrole"),
                                no,
                            ),
                        )
                        db.commit()
                        lmd.close()

                        return {'message': f"User with ID {no} has been updated."}, 200
                    else:
                        lmd.close()
                        return {"message": f"User with ID {no} not found."}, 404
                else:
                    return{"message": "you didnt have access to run this command"}
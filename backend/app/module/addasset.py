from app.config_db import get_db_connection
from flask_restful import Resource
from flask import jsonify, request
from app.config_flask import SECRET_KEY, UPLOAD_FOLDER
from werkzeug.utils import secure_filename
from flask import current_app
import json
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

def validate_addasset(ids, nama, deskripsi, brand, model, status, lokasi, kategori, sn):
    if not ids or not nama or not deskripsi or not brand or not model or not status or not lokasi or not kategori or not sn:
        return False
    return True

class AddAsset(Resource):
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
                lmd.execute("SELECT role from users where email = %s and password = %s", (email, password))
                fetch = lmd.fetchone()[0]
                if fetch == 2 or fetch == 1:
                    data = request.form 
                    ids = data.get('addAssetID')
                    nama = data.get('addAssetName')
                    deskripsi = data.get('addAssetDesc')
                    brand = data.get('addAssetBrand')
                    model = data.get('addAssetModel')
                    status = data.get('addAssetStatus')
                    lokasi = data.get('addAssetLocation')
                    kategori = data.get('addAssetCategory')
                    sn = data.get('addAssetSN')
                    
                    # Mengelola file yang diunggah (gambar) jika ada
                    file = request.files.get('addAssetImage')
                    if not validate_addasset(ids, nama, deskripsi, brand, model, status, lokasi, kategori, sn):
                        return {"message": "Data is incomplete"}, 400
                    if file:
                        original_filename = secure_filename(file.filename)
                        file_extension = os.path.splitext(original_filename)[1]
                        filename = secure_filename(ids) + file_extension
                        save_path = os.path.join(current_app.config['UPLOAD_FOLDER'], ids)
                        os.makedirs(save_path, exist_ok=True)
                        file.save(os.path.join(save_path, filename))
                        image_path = ('http://sipanda.online:5000/static/upload/' + ids + '/' + filename)
                        lmd.execute("INSERT INTO assets (asset, name, description, brand, model, status, location, category, serialnumber, photo) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (ids, nama, deskripsi, brand, model, status, lokasi, kategori, sn, image_path,))
                        db.commit()
                        lmd.close()
                        return {"message": "Asset successfully added with Photo"}, 200
                    else:
                        image_path = ('http://sipanda.online:5000/static/Default/images.jfif')
                        lmd.execute("INSERT INTO assets (asset, name, description, brand, model, status, location, category, serialnumber, photo) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (ids, nama, deskripsi, brand, model, status, lokasi, kategori, sn, image_path))
                        db.commit()
                        lmd.close()
                    return {"message": "Asset successfully added"}, 200
                else:
                    return {"message": "You don't have access to run this command"}, 403


class AddStatus(Resource):
    def post(self):
        db ,lmd = get_db_connection()
        
        token = request.headers.get('Authorization')
        if not token:
            return {'message': 'Token is missing'}, 401
        
        payload = verify_token(token)
        
        if payload:
            email = payload['email']
            password = payload['password']
            if email and password:
                lmd.execute("SELECT role from users where email = %s and password = %s", (email, password))
                fetch = lmd.fetchone()[0]
                if fetch == 2:
                    data = request.get_json()
                    newStatus = data.get('newStatus')
                    lmd.execute("SELECT status FROM status WHERE id = %s", (newStatus,))
                    existing_asset = lmd.fetchone()
                    if existing_asset:
                        return {"message": "Status exist"}
                    else:
                        lmd.execute("INSERT INTO status (status) VALUES (%s)", (newStatus,))
                        db.commit()
                        lmd.close()
                        return {"message": "Status Sucess added"}, 200
                else:
                    return{"message": "you didnt have access to run this command"}
    

class AddLocation(Resource):
    def post(self):
        db ,lmd = get_db_connection()
        
        token = request.headers.get('Authorization')
        if not token:
            return {'message': 'Token is missing'}, 401
        
        payload = verify_token(token)
        
        if payload:
            email = payload['email']
            password = payload['password']
            if email and password:
                lmd.execute("SELECT role from users where email = %s and password = %s", (email, password))
                fetch = lmd.fetchone()[0]
                if fetch == 2:
                    data = request.get_json()
                    newLocation = data.get('newLocation')
                    lmd.execute("SELECT lokasi FROM location WHERE id = %s", (newLocation,))
                    existing_asset = lmd.fetchone()
                    if existing_asset:
                        return {"message": "Status exist"}
                    else:
                        lmd.execute("INSERT INTO location (lokasi) VALUES (%s)", (newLocation,))
                        db.commit()
                        lmd.close()
                        return {"message": "Location Sucess added"}, 200
                else:
                    return{"message": "you didnt have access to run this command"}
                
class AddCategory(Resource):
    def post(self):
        db ,lmd = get_db_connection()
        
        token = request.headers.get('Authorization')
        if not token:
            return {'message': 'Token is missing'}, 401
        
        payload = verify_token(token)
        
        if payload:
            email = payload['email']
            password = payload['password']
            if email and password:
                lmd.execute("SELECT role from users where email = %s and password = %s", (email, password))
                fetch = lmd.fetchone()[0]
                if fetch == 2:
                    data = request.get_json()
                    newCategory = data.get('newCategory')
                    lmd.execute("SELECT kategori FROM category WHERE id = %s", (newCategory,))
                    existing_asset = lmd.fetchone()
                    if existing_asset:
                        return {"message": "Status exist"}
                    else:
                        lmd.execute("INSERT INTO category (kategori) VALUES (%s)", (newCategory,))
                        db.commit()
                        lmd.close()
                        return {"message": "Category Sucess added"}, 200
                else:
                    return{"message": "you didnt have access to run this command"}

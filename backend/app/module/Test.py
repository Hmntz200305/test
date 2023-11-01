from flask import request
from app.config_db import get_db_connection
import pandas as pd
from flask_restful import Resource

class UploadCsv(Resource):
    def post(self):
        db, lmd = get_db_connection()
        image_path = ('http://sipanda.online:5000/static/Default/images.jfif')
        file = request.files['csvFile']
        if not file:
            return {'message': 'No file uploaded'}, 400
        col_names = ['id','asset','name','description','brand','model','status','location','category','serialnumber']
        data = pd.read_csv(file,names=col_names, header=None, skiprows=1)
        for no,row in data.iterrows():
             row['id'] = int(row['id'])
             lmd.execute('INSERT INTO assets (asset, name, description, brand, model, status, location, category, serialnumber, photo) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)', (row['asset'], row['name'], row['description'], row['brand'], row['model'], row['status'], row['location'], row['category'], row['serialnumber'], image_path))
             db.commit()
        return {'message': 'Import telah berhasil'}, 200


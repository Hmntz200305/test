# app/module/Test.py

from flask_restful import Resource

class Test(Resource):
    def get(self):
        data = {
            'message': 'Ini adalah contoh data dari resource Test dalam file Test.py',
            'data1': 'Nilai data 1',
            'data2': 'Nilai data 2'
        }
        return data, 200

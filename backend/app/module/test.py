from flask_restful import Resource
from flask import request

class test(Resource):
    def post(self):
        data = request.json
        print('what?')
        print(data)
        return data
from flask_cors import CORS
from flask_restful import Api

def configure_cors(app):
    CORS(app)
    
def configure_api(app):
    api = Api(app)
    return api
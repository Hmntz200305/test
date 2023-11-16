from flask_cors import CORS
from flask_restful import Api

def configure_cors(app):
    CORS(app, resources={
        r"/*/*": {"origins": ["https://sipanda.online", "https://sipanda.online:2096", "https://sipanda.online:8446/"]}
    })


    
def configure_api(app):
    api = Api(app)
    return api
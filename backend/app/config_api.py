from flask_cors import CORS
from flask_restful import Api

def configure_cors(app):
    CORS(app, resources={
        r"/api/*": {"origins": ["http://sipanda.online:8080", "http://sipanda.online:5000"]}
    })
    CORS(app, resources={
        r"/static/*": {"origins": ["http://sipanda.online:8080", "http://sipanda.online:5000"]}
    })

    
def configure_api(app):
    api = Api(app)
    return api
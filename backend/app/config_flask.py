import os

SECRET_KEY = os.environ.get('SECRET_KEY', 'lmd%055@2022')
UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'backend/app/static/upload/')
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}
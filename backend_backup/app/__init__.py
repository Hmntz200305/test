from flask import Flask, send_from_directory, render_template
from app.config_flask import SECRET_KEY, UPLOAD_FOLDER
from app.config_api import configure_cors, configure_api
from app.module.resource import Test, Login, ListAsset, DeleteAsset, StatusList, LocationList, CategoryList, EditAsset, AddStatus, AddLocation, AddCategory, AddAsset, Register, ManageUser, Authentication, DeleteUser, EditUser, LeaseTicket, ListAssetExcept, AdminList, LeaseSubmited, TicketApprove, TicketDecline, DashboardInfo, inLoanAssetList, ReturnAsset

app = Flask(__name__)
configure_cors(app)
api = configure_api(app)
app.config['SECRET_KEY'] = SECRET_KEY
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

api.add_resource(Test, '/Test')
api.add_resource(Login, '/api/login')
api.add_resource(Authentication, '/api/authentication')
api.add_resource(AdminList, '/api/adminlist')
api.add_resource(ListAsset, '/api/getdata-listasset')
api.add_resource(ListAssetExcept, '/api/getdata-listassetexcept')
api.add_resource(EditAsset, '/api/edit-asset/<int:idasset>')
api.add_resource(DeleteAsset, '/api/delete-asset/<string:asset_id>')
api.add_resource(StatusList, '/api/getdata-statuslist')
api.add_resource(LocationList, '/api/getdata-locationlist')
api.add_resource(CategoryList, '/api/getdata-categorylist')
api.add_resource(AddStatus, '/api/addstatus')
api.add_resource(AddLocation, '/api/addlocation')
api.add_resource(AddCategory, '/api/addcategory')
api.add_resource(AddAsset, '/api/addasset')
api.add_resource(Register, '/api/register')
api.add_resource(ManageUser, '/api/manageuser')
api.add_resource(DeleteUser, '/api/delete-user/<int:no>')
api.add_resource(EditUser, '/api/edit-user/<int:no>')
api.add_resource(LeaseTicket, '/api/leaseticket')
api.add_resource(LeaseSubmited, '/api/leasesubmited')
api.add_resource(TicketDecline, '/api/ticketdecline/<int:selectedTicketId>')
api.add_resource(TicketApprove, '/api/ticketapprove/<int:selectedTicketId>')
api.add_resource(DashboardInfo, '/api/DashboardInfo')
api.add_resource(inLoanAssetList, '/api/dataloan')
api.add_resource(ReturnAsset, '/api/returnsloan/<int:selectedLoanID>')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
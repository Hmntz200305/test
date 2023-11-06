from app.config_db import get_db_connection
from flask_restful import Resource

class DashboardInfo(Resource):
    def get(self):
        db, lmd = get_db_connection()
        
        asset_statuses = ['Available', 'on Request', 'in Loans', 'Broken', 'Missing', 'Maintenance']
        counts = {'total_assets': 0}

        for status in asset_statuses:
            lmd.execute('SELECT count(*) from assets where status = %s', (status,))
            count = lmd.fetchone()[0]
            counts[status.lower()] = count
            counts['total_assets'] += count

        lmd.execute('SELECT count(*) from loandata where status = %s', (1,))
        counts['returning'] = lmd.fetchone()[0]

        return counts
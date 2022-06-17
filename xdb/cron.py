from datetime import timedelta
from datetime import datetime

import django
django.setup()


from .models import Telegram_User, Post, Win, ExcelExport

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync





def force_fail_all_running_spreadsheet_tasks():
    channel_layer = get_channel_layer()
    time_threshold = datetime.now() - timedelta(hours=3)
    runningExports = ExcelExport.objects.filter(task_status="running", date_added__lt=time_threshold).all()
    if len(runningExports) > 0:

        runningExports.update(task_status="failed")

        for eachExport in runningExports:
            async_to_sync(channel_layer.group_send)(
                'export_maingroup',
                {
                    'type': 'chat_message',
                    'spreadsheetID': str(eachExport.id),
                    'status': 'failed',
                    'exportDate': eachExport.date_added.strftime('%d %b %Y %H:%M')
                }
                    )

    print(f"{len(runningExports)} Updated.")

    


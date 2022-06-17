import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

import django
django.setup()


from .models import Telegram_User, Post, Win, ExcelExport
from django_q.tasks import async_task, result
from .export_posts_csv import Generate_Posts_CSV

class ExportConsumer(WebsocketConsumer):
    def connect(self):
        self.room_group_name = 'export_maingroup'

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        post_ids = text_data_json['post_ids']
        export_posts = text_data_json['export_posts']
        export_wins = text_data_json['export_wins']
        win_type = text_data_json['win_type']
        winning_amount = text_data_json['prize_money']

        if win_type == "":
            win_type = None
        
        if winning_amount == "":
            winning_amount = None

        print(post_ids)
        print(export_posts)
        print(export_wins)
        print(win_type)
        print(winning_amount)

        excelExport = ExcelExport()
        excelExport.save()

        spreadsheetID = str(excelExport.id)
        exportDate = excelExport.date_added.strftime('%d %b %Y %H:%M')


        task_id = async_task("xdb.export_posts_csv.Generate_Posts_CSV", post_ids, export_posts, export_wins, win_type, winning_amount, spreadsheetID, hook="xdb.export_posts_csv.Finalize_Spreadsheet", ack_failure=True)











        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'spreadsheetID': spreadsheetID,
                'status': 'running',
                'exportDate': exportDate

            }
        )

    # Receive message from room group
    def chat_message(self, event):
        print(event)
        spreadsheetID = event['spreadsheetID']
        status = event['status']
        exportDate = event['exportDate']
        print("bruh")

        # Send message to WebSocket
        self.send(text_data=json.dumps({
                'spreadsheetID': spreadsheetID,
                'status': status,
                'exportDate': exportDate
        }))
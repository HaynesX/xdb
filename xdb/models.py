from django.db import models
import uuid

class Telegram_User(models.Model):
    id = models.AutoField(primary_key=True)
    telegram_id = models.CharField(max_length=30)
    telegram_username = models.CharField(max_length=30, default='', blank=True)
    wallet_address = models.CharField(max_length=64, default='', blank=True)


class Post(models.Model):
    id = models.AutoField(primary_key=True)
    tweet_id = models.CharField(max_length=30)
    tweet_text = models.TextField(max_length=300)
    twitter_username = models.CharField(max_length=40, blank=True, default="")
    tweet_date = models.DateTimeField()
    tweet_mentions = models.TextField(max_length=300, blank=True, default="")
    tweet_hashtags = models.TextField(max_length=300, blank=True, default="")
    tweet_char_length = models.IntegerField(default=0)

    telegram_message_id = models.CharField(max_length=30)
    telegram_message_date = models.DateTimeField(auto_now_add=True, blank=True)

    is_winner = models.BooleanField(default=False)


    user = models.ForeignKey(Telegram_User, on_delete=models.CASCADE)


class Win(models.Model):
    id = models.AutoField(primary_key=True)
    win_type = models.CharField(max_length=30)
    winning_amount = models.DecimalField(max_digits=7, decimal_places=2, blank=True)
    winning_transaction = models.TextField(max_length=300, blank=True, default="")

    post = models.ForeignKey(Post, on_delete=models.CASCADE)



class ExcelExport(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date_added = models.DateTimeField(auto_now_add=True, blank=True)
    task_id = models.CharField(max_length=128, default='', blank=True)
    task_status = models.CharField(max_length=128, default='running', blank=True)










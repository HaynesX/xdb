from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

from telegram_bot.views import ReceiveMessageBotView

urlpatterns = [
    path('webhooks/bot/', csrf_exempt(ReceiveMessageBotView.as_view())), # This URL Path is for the Telegram Bot Webhook
    path("make-telegram-announcement", views.AjaxPostsAnnouncementView.as_view()), # This URL Path is for the Web Application to send an AJAX Request to.
]
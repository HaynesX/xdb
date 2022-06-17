"""
ASGI config for xdb_price_chat project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/
"""

import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.layers import get_channel_layer
from xdb.routing import websocket_urlpatterns




# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "xdb_price_chat.settings")

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "xdb_price_chat.settings")

# env = environ.Env()
# environ.Env.read_env()

application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})

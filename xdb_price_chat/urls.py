"""xdb_price_chat URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.contrib.admin.views.decorators import staff_member_required



urlpatterns = [
    path('admin/', admin.site.urls),
    # path('login/', staff_member_required(auth_views.LoginView.as_view(template_name='admin/login.html',
    # extra_context={
    #     'title': 'Login',
    #     'site_title': 'XDB Price Chat Management',
    #     'site_header': 'XDB Login'})), name="login"),
    path('login/', auth_views.LoginView.as_view(template_name='admin/login.html',
    extra_context={
        'title': 'Login',
        'site_title': 'XDB Price Chat Management',
        'site_header': 'XDB Login'}), name="login"),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    
    path('', include("xdb.urls")),
    path('tgbot/', include("telegram_bot.urls")),
]

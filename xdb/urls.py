from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("management/", views.giveaway_management, name="giveaway_management"),
    path("management/<int:month>", views.giveaway_management, name="giveaway_management"),
    path("export_csv/<str:spreadsheetID>", views.export_csv, name="export_csv"),
    path("posts/win/", views.AjaxPostsWinView.as_view()),
    path("posts/win/update", views.AjaxPostsWinUpdateView.as_view()),
    path("posts/win/delete", views.AjaxPostsWinDeleteView.as_view()),
    path("posts/delete", views.AjaxPostsDeleteView.as_view()),
    path("bulk-management/", views.bulk_management, name="bulk_management"),
    path("posts/filter/", views.AjaxPostsFilterGetView.as_view()),

    path("wins/create/", views.Ajax_Wins_Create.as_view()),
    path("wins/update/", views.Ajax_Wins_Update.as_view()),
    path("wins/delete/", views.Ajax_Wins_Delete.as_view()),
    path("test-file-download/", views.Test_File_Download.as_view()),

    

    
    
]
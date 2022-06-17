from re import T
import os
import time
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, Http404
from .models import ExcelExport, Telegram_User, Post, Win
from datetime import date, timedelta, datetime, timezone
from django.utils import timezone
from django.views.generic import View
from django.utils.decorators import method_decorator
import validators
import json
from functools import wraps
from django.core.exceptions import PermissionDenied
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.decorators import method_decorator
from dateutil.parser import parse
from .export_posts_csv import Test_Gen_Posts, Test_Django_Q
from django_q.tasks import async_task, result

from .announcement_messages_template import announcement_messages_template_dict


allowed_win_types = ["Random Draw", "Tweet of the Week", "Soldier of the Month", "Soldier of the Quarter", "True Soldier"]

months = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December",
    }





# Checks if User is Staff Member specifically for AJAX Requests only.
def ajax_login_required(view):
    @wraps(view)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_staff:
            jsonText = json.dumps({ 'not_authenticated': True })
            return HttpResponse(jsonText, content_type='application/json', status=401)
            
        return view(request, *args, **kwargs)
    return wrapper




def verify_win(win_type, prize_money, transaction_hash):
    if win_type in allowed_win_types:
        try:
            prize_money = float(prize_money)
        except ValueError:
            return JsonResponse(status=404, data={'status':'false','message':'Invalid Prize Money Value'})
                
        if prize_money < 0 or prize_money > 9999999:
            return JsonResponse(status=404, data={'status':'false','message':'Invalid Prize Money Value. Input Value Between 0 and 9999999'})
                
        if transaction_hash != '':
            if validators.url(transaction_hash) != True:
                return JsonResponse(status=404, data={'status':'false','message':'Invalid Link Format'})
    else:
        return JsonResponse(status=404, data={'status':'false','message':'Invalid Win Type'})
            
    return True





def verify_win_bulk(win_type, prize_money):
    if win_type in allowed_win_types:
        try:
            prize_money = float(prize_money)
        except ValueError:
            return 'Invalid Prize Money Value'
                
        if prize_money < 0 or prize_money > 9999999:
            return 'Invalid Prize Money Value. Input Value Between 0 and 9999999'

    else:
        return 'Invalid Win Type'
            
    return True






def index(request):
    return render(request, "xdb/index.html")




@staff_member_required
def giveaway_management(request, month=""):


    if month == "":
        month = datetime.utcnow().month
    else:
        if month not in months:
            month = datetime.utcnow().month


    startDate = datetime.utcnow().replace(tzinfo=timezone.utc)

    allPosts = Post.objects.filter(telegram_message_date__year=datetime.utcnow().year, telegram_message_date__month=month).all().order_by("-telegram_message_date")

    days = {}

    for eachPost in allPosts:
        if eachPost.is_winner:
            wins = Win.objects.filter(post=eachPost.id).all()
        else:
            wins = []
        eachPostDay = eachPost.telegram_message_date.day
        eachPostMonth = eachPost.telegram_message_date.month
        eachPostYear = eachPost.telegram_message_date.year
        eachPostDate = f"{eachPostDay}-{eachPostMonth}-{eachPostYear}"
        if eachPostDate not in days:
            days[eachPostDate] = []

        

        flags = []

        tweetMentionsString = eachPost.tweet_mentions
        tweetMentions = []

        if tweetMentionsString != "":
            tweetMentions = tweetMentionsString.split(",")


        tweetHashtagsString = eachPost.tweet_hashtags
        tweetHashtags = []

        if tweetHashtagsString != "":
            tweetHashtags = tweetHashtagsString.split(",")
        
        tweetCharLength = eachPost.tweet_char_length


        if len(tweetMentions) < 5:
            flags.append(f"{len(tweetMentions)}/5 Mentions were Included in the Tweet")
        
        if len(tweetHashtags) < 5:
            flags.append(f"{len(tweetMentions)}/5 Hashtags were Included in the Tweet")
        

        if tweetCharLength < 120:
            flags.append(f"Less Than 120 Characters in Tweet")

        
        days[eachPostDate].append([eachPost, flags, tweetMentions, wins])
    


    context = {}
    context["days"] = days
    context["monthChosen"] = months[month]
    context["announcement_messages_template_dict"] = announcement_messages_template_dict

   
    return render(request, "xdb/giveaway.html", context)



@staff_member_required
def bulk_management(request):
    context = {}
    context["win_types"] = allowed_win_types



    runningExports = ExcelExport.objects.filter(task_status="running").order_by('-date_added').all()
    successfulExports = ExcelExport.objects.filter(task_status="successful").order_by('-date_added').all()
    failedExports = ExcelExport.objects.filter(task_status="failed").order_by('-date_added').all()

    context["running_exports"] = runningExports
    context["successful_exports"] = successfulExports
    context["failed_exports"] = failedExports






    return render(request, "xdb/bulk_management.html", context)










@method_decorator(ajax_login_required, name='dispatch')
class Ajax_Wins_Create(View):
    def post(self, request):
        print(request.POST)
        winningPosts = request.POST.getlist('post_ids[]')
        win_type = request.POST.get('win_type')
        prize_money = request.POST.get('prize_money')

        successfulWins = []
        failedWins = []

        print(winningPosts)

        for eachPost in winningPosts:
            post_id = int(eachPost)
            print(post_id)

            post = Post.objects.filter(id=post_id).first()
            if post:
                verifyWin = verify_win_bulk(win_type, prize_money)

                if verifyWin == True:
                    newWin = Win(win_type=win_type, winning_amount=prize_money, post=post)
                    
                    newWin.save()
                    if post.is_winner == False:
                        post.is_winner = True
                    post.save()

                    returnedPost = {
                        "win_id": newWin.id,
                        "id": post.id,
                        "prize_money": prize_money,
                        "win_type": win_type
                    }

                    successfulWins.append(returnedPost)

                else:
                    failedWins.append([post_id, verifyWin])
            else:
                failedWins.append([post_id, "Post does not exist"])
        

        return JsonResponse({"data": {"failedWins": failedWins, "successfulWins": successfulWins}})
        



@method_decorator(ajax_login_required, name='dispatch')
class Ajax_Wins_Update(View):

    def post(self, request):

        selectedWins = request.POST.getlist('win_ids[]')
        win_type = request.POST.get('win_type')
        prize_money = request.POST.get('prize_money')

        successfulWins = []
        failedWins = []

        verifyWin = verify_win_bulk(win_type, prize_money)

        if verifyWin == True:
            for eachWin in selectedWins:
                win_id = int(eachWin)

                win = Win.objects.filter(id=win_id).first()
                if win:
                    win.win_type = win_type
                    win.winning_amount = prize_money
                    win.save()
                    successfulWins.append({"win_id": win_id, "post_id": win.post.id, "win_type": win_type, "prize_money": prize_money})
                else:
                    failedWins.append([win_id, "Win does not exist"])
        else:
            failedWins.append(["Edit Win", verifyWin])
        

        return JsonResponse({"data": {"failedWins": failedWins, "successfulWins": successfulWins}})




     



@method_decorator(ajax_login_required, name='dispatch')
class Ajax_Wins_Delete(View):

    def post(self, request):

        selectedWins = request.POST.getlist('win_ids[]')

        successfulWins = []
        failedWins = []


        for eachWin in selectedWins:
            win_id = int(eachWin)

            win = Win.objects.filter(id=win_id).first()
            if win:
                post_id = win.post.id

                win.delete()
                totalWinsInPost = Win.objects.filter(post__id=post_id).count()
                if totalWinsInPost == 0:
                    post = Post.objects.filter(id=post_id).first()
                    post.is_winner = False
                    post.save()
                    
                else:
                    print(f"{totalWinsInPost} = TotalWinsInPost")

                successfulWins.append({"win_id": win_id, "post_id": post_id})
            else:
                failedWins.append([win_id, "Win does not exist"])
        

        return JsonResponse({"data": {"failedWins": failedWins, "successfulWins": successfulWins}})






@staff_member_required
def export_csv(request, spreadsheetID):
    dir_path = os.path.dirname(os.path.realpath(__file__))
    file_path = f"{dir_path}/exports/{spreadsheetID}.xlsx"
    if os.path.exists(f"{dir_path}/exports/{spreadsheetID}.xlsx"):
        with open(file_path, 'rb') as fh:
            response = HttpResponse(fh.read(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = 'inline; filename=' + f"{spreadsheetID}.xlsx"
            return response
    raise Http404






@method_decorator(ajax_login_required, name='dispatch')
class Test_File_Download(View):
    def get(self, request):
        # Test_Gen_Posts()


        # task_id = async_task("xdb.export_posts_csv.Test_Django_Q", "bruhhhhh89rhb", hook="xdb.export_posts_csv.Test_Django_Q_Hook", ack_failure=True)

        excelExportsRunning = ExcelExport.objects.filter(task_status="running").all().delete()

       






        
        

        return JsonResponse({"data": {"excelExportsRunning": ""}})




















































































































def verifyDate(dateString):
    try:
        newDate = parse(dateString, dayfirst=True).date()
    except ValueError:
        newDate = date.today()
    
    if newDate > date.today():
        newDate = date.today()
    
    return newDate




equivalent_wins_to_post_keys = {
    "post__id": "id",
    "post__user__telegram_username": "user__telegram_username",
    "post__telegram_message_id": "telegram_message_id",
    "post__tweet_id": "tweet_id",
    "post__is_winner": "is_winner",
    "post__telegram_message_date": "telegram_message_date",
    "post__tweet_text": "tweet_text"
}



def changeEquivalentWinsToPosts(allPosts):
    for eachPost in allPosts:
        for eachKey in equivalent_wins_to_post_keys:
            eachPost[eachKey]
            eachPost[equivalent_wins_to_post_keys[eachKey]] = eachPost[eachKey]
            del eachPost[eachKey]
    

    return allPosts





def getPostsUsingWinType(win_type, filter_username, startDate, endDate):

    # if win_type not in allowed_win_types:
    #     return []


    allPostsNoWins = Post.objects.filter(user__telegram_username__contains=filter_username, telegram_message_date__range=(startDate, endDate), is_winner=True).all().order_by("user__telegram_username", "-telegram_message_date")
   
    allPosts = list(Win.objects.filter(post__in=allPostsNoWins, win_type=win_type).all().values("post__id", "post__user__telegram_username", "post__telegram_message_id", "post__tweet_id", "post__is_winner", "post__tweet_text", "post__telegram_message_date"))
    allPosts = changeEquivalentWinsToPosts(allPosts=allPosts)

    return allPosts








@method_decorator(ajax_login_required, name='dispatch')
class AjaxPostsFilterGetView(View):

    def post(self, request):
        filter_startDate = request.POST.get('filter_startDate')
        filter_endDate = request.POST.get('filter_endDate')
        filter_username = request.POST.get('filter_username')
        filter_win = request.POST.get('filter_win')

        print(filter_startDate)
        print(filter_endDate)
        print(filter_username)
        print(filter_win)

        startDate = verifyDate(filter_startDate)
        endDate = verifyDate(filter_endDate)

        endDate = endDate + timedelta(days=1)

        if filter_win == "--":
            allPosts = list(Post.objects.filter(user__telegram_username__contains=filter_username, telegram_message_date__range=(startDate, endDate)).all().order_by("user__telegram_username", "-telegram_message_date").values("id", "user__telegram_username", "telegram_message_id", "tweet_id", "is_winner", "tweet_text", "telegram_message_date"))
        elif filter_win == "ONLY Winning Posts":
            allPosts = list(Post.objects.filter(user__telegram_username__contains=filter_username, telegram_message_date__range=(startDate, endDate), is_winner=True).all().order_by("user__telegram_username", "-telegram_message_date").values("id", "user__telegram_username", "telegram_message_id", "tweet_id", "is_winner", "tweet_text", "telegram_message_date"))
        # elif filter_win == "Random Draw":
        #     allPostsNoWins = Post.objects.filter(user__telegram_username__contains=filter_username, telegram_message_date__range=(startDate, endDate), is_winner=True).all().order_by("user__telegram_username", "-telegram_message_date")
        #     allPosts = list(Win.objects.filter(post__in=allPostsNoWins, win_type="Random Draw").all().values("post__id", "post__user__telegram_username", "post__telegram_message_id", "post__tweet_id", "post__is_winner", "post__tweet_text", "post__telegram_message_date"))

        #     allPosts = changeEquivalentWinsToPosts(allPosts=allPosts)

        # elif filter_win == "Tweet of the Week":
        #     allPostsNoWins = Post.objects.filter(user__telegram_username__contains=filter_username, telegram_message_date__range=(startDate, endDate), is_winner=True).all().order_by("user__telegram_username", "-telegram_message_date")
        #     allPosts = list(Win.objects.filter(post__in=allPostsNoWins, win_type="Tweet of the Week").all().values("post__id", "post__user__telegram_username", "post__telegram_message_id", "post__tweet_id", "post__is_winner", "post__tweet_text", "post__telegram_message_date"))

        #     allPosts = changeEquivalentWinsToPosts(allPosts=allPosts)
        # elif filter_win == "Soldier of the Quarter":
        #     allPostsNoWins = Post.objects.filter(user__telegram_username__contains=filter_username, telegram_message_date__range=(startDate, endDate), is_winner=True).all().order_by("user__telegram_username", "-telegram_message_date")
        #     allPosts = list(Win.objects.filter(post__in=allPostsNoWins, win_type="Soldier of the Quarter").all().values("post__id", "post__user__telegram_username", "post__telegram_message_id", "post__tweet_id", "post__is_winner", "post__tweet_text", "post__telegram_message_date"))

        #     allPosts = changeEquivalentWinsToPosts(allPosts=allPosts)
        elif filter_win == "EXCLUDE Winning Posts":
            allPosts = list(Post.objects.filter(user__telegram_username__contains=filter_username, telegram_message_date__range=(startDate, endDate), is_winner=False).all().order_by("user__telegram_username", "-telegram_message_date").values("id", "user__telegram_username", "telegram_message_id", "tweet_id", "is_winner", "tweet_text", "telegram_message_date"))
        else:
            if filter_win in allowed_win_types:
                allPosts = getPostsUsingWinType(filter_win, filter_username, startDate, endDate)
            else:
                allPosts = []

        for eachPost in allPosts:
            eachPost["telegram_message_date"] = eachPost["telegram_message_date"].strftime('%d %b %Y %H:%M')

        
        postsWins = {}

        for eachPost in allPosts:
            postsWins[eachPost["id"]] = {}
            wins = Win.objects.filter(post__id=eachPost["id"]).all()
            for eachWin in wins:
                postsWins[eachPost["id"]][eachWin.id] = {"win_type": eachWin.win_type, "prize_money": eachWin.winning_amount}


            # 2022-06-11T14:46:07.233Z
        
# __range=(start_date, end_date)
        

# .win_set

        

        # allPosts = list(Post.objects.filter(user__telegram_username__contains=filter_username).all().order_by("user__telegram_username", "-telegram_message_date").values("id", "user__telegram_username", "telegram_message_id", "tweet_id"))

        # listOfDicts = allPosts.values()

        # print(listOfDicts)
        # print(allPosts)

        return JsonResponse({"data": {"posts": allPosts, "postsWins": postsWins}})



















@method_decorator(ajax_login_required, name='dispatch')
class AjaxPostsDeleteView(View):

    def post(self, request):
        post_id = request.POST.get('post_id')

        postObject = Post.objects.filter(id=post_id).first()

        if postObject:
            postObject.delete()
            return JsonResponse({"data": {"Deleted Post": "bruh"}})
        else:
            return JsonResponse(status=404, data={'status':'false','message':'Post Does Not Exist'})



        


@method_decorator(ajax_login_required, name='dispatch')
class AjaxPostsWinUpdateView(View):

    def post(self, request):
        win_id = request.POST.get('win_id')
        win_type = request.POST.get('win_type')
        prize_money = request.POST.get('prize_money')
        transaction_hash = request.POST.get('transaction_hash')

        verifyWin = verify_win(win_type, prize_money, transaction_hash)

        winObject = Win.objects.filter(id=win_id).first()
        if winObject:
            if verifyWin == True:
                winObject.win_type = win_type
                winObject.winning_amount = float(prize_money)
                winObject.winning_transaction = transaction_hash

                winObject.save()

                winObjectDict = {"win_id": win_id, "win_type": winObject.win_type, "prize_money": winObject.winning_amount, "winning_transaction": winObject.winning_transaction}

                return JsonResponse({"data": winObjectDict})
            else:
                return verifyWin




        return JsonResponse(status=404, data={'status':'false','message':'Win Does Not Exist'})







@method_decorator(ajax_login_required, name='dispatch')
class AjaxPostsWinDeleteView(View):

    def post(self, request):
        win_id = request.POST.get('win_id')

        winObject = Win.objects.filter(id=win_id).first()
        if winObject:
            winObject.delete()
            return JsonResponse({"data": {"Deleted Win": "bruh"}})
        else:
            return JsonResponse(status=404, data={'status':'false','message':'Win Does Not Exist'})







@method_decorator(ajax_login_required, name='dispatch')
class AjaxPostsWinView(View):

    def post(self, request):
        post_id = request.POST.get('post_id')
        win_type = request.POST.get('win_type')
        prize_money = request.POST.get('prize_money')
        transaction_hash = request.POST.get('transaction_hash')

        post = Post.objects.filter(id=post_id).first()
        if post:
            verifyWin = verify_win(win_type, prize_money, transaction_hash)

            if verifyWin == True:
                newWin = Win(win_type=win_type, winning_amount=prize_money, winning_transaction=transaction_hash, post=post)
                
                newWin.save()
                if post.is_winner == False:
                    post.is_winner = True
                post.save()

                returnedPost = {
                    "post_id": post.id,
                    "win_id": newWin.id,
                    "prize_money": prize_money,
                    "win_type": win_type,
                    "transaction_hash": transaction_hash
                }

                return JsonResponse({"data": returnedPost})

            else:
                return verifyWin
        else:
            return JsonResponse(status=404, data={'status':'false','message':'Post Does Not Exist'})

            








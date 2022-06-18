from .models import Telegram_User, Post, Win, ExcelExport
import pandas as pd
import xlsxwriter
import time
import os
from asgiref.sync import async_to_sync
import uuid

from channels.layers import get_channel_layer
channel_layer = get_channel_layer()


def Get_Posts(post_ids):
    posts = Post.objects.filter(id__in=post_ids)
    return posts


def Get_Wins(post_ids, win_type=None, winning_amount=None):
    arguments = locals()
    filters = {'post__id__in': post_ids}

    
    
    for eachKey in arguments:
        if eachKey == 'post_ids' or arguments[eachKey] == None:
            continue
    
        

        filters[eachKey] = arguments[eachKey]
    
    print(filters)
    

    
    wins = Win.objects.filter(**filters).all()
    print(wins)

    return wins


# def format_function(workbook, bg_color = 'red'):
#     global format
#     format = workbook.add_format({
#     'bg_color' : bg_color
#     })
#     return workbook




def Generate_Posts_CSV(post_ids, export_posts, export_wins, win_type=None, winning_amount=None, fileName='default'):

    dir_path = os.path.dirname(os.path.realpath(__file__))

    finalPostsWinsMatrix = []

    postsWinsDict = {}



    postHeader = ["Post_Header", ["Username", "ID", "Date", "Twitter Link", "Telegram Link"]]

    winHeader = ["Win_Header", ["Win ID", "Win Type", "Win Prize Money", "User Wallet Address", "Username"]]




    if export_posts == True and export_wins == False:
        finalPostsWinsMatrix.append(postHeader)
        posts = Get_Posts(post_ids)

        for post in posts:
            finalPostsWinsMatrix.append(["Post", [post.user.telegram_username, post.id, post.telegram_message_date.__str__(), f"'https://twitter.com/XDB/status/{post.tweet_id}'", f"'https://t.me/DigitalBitsPriceChat/{post.tweet_id}'"]])




    elif export_posts == False and export_wins == True:
        finalPostsWinsMatrix.append(winHeader)
        wins = Get_Wins(post_ids, win_type, winning_amount)

        for win in wins:
            finalPostsWinsMatrix.append(["Win", [win.id, win.win_type, win.winning_amount, win.post.user.wallet_address, win.post.user.telegram_username]])




            
    elif export_posts == True and export_wins == True:
        finalPostsWinsMatrix.append(postHeader)
        posts = Get_Posts(post_ids)
        wins = Get_Wins(post_ids, win_type, winning_amount)

        for post in posts:
            postsWinsDict[post.id] = {
                "Username": post.user.telegram_username,
                "ID": post.id,
                "Date": post.telegram_message_date,
                "Twitter Link": f"https://twitter.com/XDB/status/{post.tweet_id}",
                "Telegram Link": f"https://t.me/DigitalBitsPriceChat/{post.tweet_id}",
                "wins": []
            }
        
        for win in wins:
            post_id = win.post.id
            win = [win.id, win.win_type, win.winning_amount, win.post.user.wallet_address, win.post.user.telegram_username]
            postsWinsDict[post_id]["wins"].append(win)
        

        for eachPostID in postsWinsDict:
            postList = [
                postsWinsDict[eachPostID]["Username"],
                eachPostID,
                postsWinsDict[eachPostID]["Date"].__str__(),
                f"""'{postsWinsDict[eachPostID]["Twitter Link"]}'""",
                f"""'{postsWinsDict[eachPostID]["Telegram Link"]}'"""
            ]

            finalPostsWinsMatrix.append(["Post", postList])
            # if len(postsWinsDict[eachPostID]["wins"]) > 0:
            #     finalPostsWinsMatrix.append(winHeader)

            for eachWin in postsWinsDict[eachPostID]["wins"]:
                finalPostsWinsMatrix.append(["Win", eachWin])
            
            finalPostsWinsMatrix.append(["Blank", ["", "", "", "", "", ""]])










    rowsOnlyFinalPostsWinsMatrix = []
    for eachRow in finalPostsWinsMatrix:
        rowsOnlyFinalPostsWinsMatrix.append(eachRow[1])



    
    df = pd.DataFrame(rowsOnlyFinalPostsWinsMatrix)
    writer = pd.ExcelWriter(f'{dir_path}/exports/{fileName}.xlsx', engine='xlsxwriter')
    print(f'{dir_path}/exports/{fileName}.xlsx')
    print(f'{dir_path}/exports/{fileName}.xlsx')
    print(f'{dir_path}/exports/{fileName}.xlsx')
    df.to_excel(writer, sheet_name='Sheet1', index=False, header=False)

    workbook = writer.book
    worksheet = writer.sheets['Sheet1']

    worksheet.set_column('A:A', 15)
    worksheet.set_column('B:B', 20)
    worksheet.set_column('C:C', 30)
    worksheet.set_column('D:K', 60)

    for count, eachRow, in enumerate(finalPostsWinsMatrix, start=0):
        if eachRow[0] == "Post_Header":
            print(eachRow)
            format = workbook.add_format({'bold': True, 'font_color': 'white', "bg_color": '#4f81bd', 'align': 'center', 'valign': 'center', 'shrink': True, 'font_size': 15, 'border': 1})
            worksheet.set_row(count, None, format)
        elif eachRow[0] == "Win_Header":
            print(eachRow)
            format = workbook.add_format({'bold': True, 'font_color': 'white', "bg_color": '#aad08e', 'align': 'center', 'valign': 'center', 'shrink': True, 'font_size': 15, 'border': 1})
            worksheet.set_row(count, None, format)
        elif eachRow[0] == "Post":
            format = workbook.add_format({'font_color': 'black', "bg_color": '#b8cce4', 'shrink': True, 'align': 'center', 'valign': 'center', 'font_size': 15, 'border': 1})
            worksheet.set_row(count, None, format)
        elif eachRow[0] == "Win":
            format = workbook.add_format({'font_color': 'white', "bg_color": '#70ad47', 'shrink': True, 'align': 'center', 'valign': 'center', 'font_size': 15, 'border': 1})
            worksheet.set_row(count, None, format)
        elif eachRow[0] == "Blank":
            format = workbook.add_format({})
            worksheet.set_row(count, None, format)
        else:
            format = workbook.add_format({'font_color': 'white', "bg_color": '#ffffff', 'shrink': True, 'align': 'center', 'valign': 'center', 'font_size': 15, 'border': 1})
            worksheet.set_row(count, None, format)



    writer.save()

    return fileName


    

    # my_df = pd.DataFrame(finalPostsWinsMatrix)
    # my_df.to_csv('my_csv.csv', index=False, header=False)

def Finalize_Spreadsheet(task):
    if task.success == False:
        print("Task FAILED")
        print(task.args)
        dir_path = os.path.dirname(os.path.realpath(__file__))

        time.sleep(2)

        if os.path.exists(f"{dir_path}/exports/{task.args[5]}.xlsx"):
            os.remove(f"{dir_path}/exports/{task.args[5]}.xlsx")
            print("The file has been deleted successfully")
        

        excelExport = ExcelExport.objects.filter(id=uuid.UUID(task.args[5])).first()
        if excelExport:
            excelExport.task_status = "failed"
            excelExport.task_id = task.id
            excelExport.save()
        
        exportDate = excelExport.date_added.strftime('%d %b %Y %H:%M')



        async_to_sync(channel_layer.group_send)(
            'export_maingroup',
            {
                'type': 'chat_message',
                'spreadsheetID': task.args[5],
                'status': 'failed',
                'exportDate': exportDate

            }
        )


    else:
        print(task.result)
        print("start of args")
        print(task.args)
        print("end of args")

        excelExport = ExcelExport.objects.filter(id=uuid.UUID(task.args[5])).first()
        if excelExport:
            excelExport.task_status = "successful"
            excelExport.task_id = task.id
            excelExport.save()
        
        exportDate = excelExport.date_added.strftime('%d %b %Y %H:%M')


    
        async_to_sync(channel_layer.group_send)(
                'export_maingroup',
                {
                    'type': 'chat_message',
                    'spreadsheetID': task.args[5],
                    'status': 'successful',
                    'exportDate': exportDate
                }
            )



def Test_Gen_Posts():
    Generate_Posts_CSV([58, 59, 57, 60, 56], True, True, None, None)


def Test_Django_Q_Hook(task):
    print(task.result)
    print(task.result)
    print(task.result)


def Test_Django_Q(number):
    print()
    float(number)
    print("Sleeping for 5")
    time.sleep(5)
    return float(number)

        


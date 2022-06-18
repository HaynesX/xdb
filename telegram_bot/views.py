from ast import For, excepthandler
from curses import KEY_EXIT
import json
import os
from datetime import datetime
from datetime import date
from dateutil import parser

import time

import requests
from django.http import JsonResponse
from django.views import View

from xdb.models import Telegram_User, Post, Win

from xdb.views import ajax_login_required
from django.utils.decorators import method_decorator


TELEGRAM_URL = "https://api.telegram.org/bot"
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TWITTER_API_KEY = os.getenv("TWITTER_API_KEY")
TWITTER_BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")



getTweetsURL = 'https://api.twitter.com/2/tweets'



auth_headers = {
	'Authorization': f'Bearer {TWITTER_BEARER_TOKEN}',
	'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
}

auth_data = {
	'grant_type': 'client_credentials'
}



# Template of Messages to be sent to the TG Bot if the KEY is matched.
giveawayResponses = {
	"MAX_5_POSTS_REACHED": "❗ You Have Posted the Maximum of 5 Tweets Today. \n<b>Please Wait Until Tomorrow to Post Again!</b> ❗",
	"DUPLICATE_TWEETS": "🚫 <b>Tweet already in giveaway!</b> \nSubmission NOT Added! 🚫",
	"POSTS_ADDED": "<b>Submission Added!</b> 🎉",
	"INVALID_TWEET": "ERROR. This seems to be an invalid tweet."
}

giveawayIgnoreResponses = ["NO_POSTS"]





# This Class-Based View is to receive requests from the Telegram Bot (using webhook).
class ReceiveMessageBotView(View):

	def post(self, request, *args, **kwargs):
		print(request)
		t_data = json.loads(request.body) # Telegram Message Request converted to a Dictionary

		# The purpose of this try-except statement is to ensure that the t_data dictionary contains the correct data.
		try:
			t_message = t_data["message"]
			user_id = t_message["from"]["id"] # User ID of the Message
			message_id = t_message["message_id"] # Message ID of the Message
			t_chatID = t_message["chat"]["id"] # Chat ID of the Message (Channel ID)
			
			


			# If-Else Statement to set Username as their "@HANDLE" IF THERE IS A HANDLE, or their "FirstName" if they haven't set a Username.
			if "username" in t_message["from"]:
				username = f"""@{t_message["from"]["username"]}"""
			else:
				username = t_message["from"]["first_name"]

		except:
			return JsonResponse({"ok": "POST Request Invalid. Ignoring."})


		
		

		try:
			text = t_message["text"].strip().lower().split() # Removes unnecessary spaces with strip(), sets all text to lowercase with lower() and puts all text keywords in to a list.
		except Exception as e:
			return JsonResponse({"ok": "POST Request Invalid. Ignoring."})

		

		if "#giveaway" in text:
			giveawayVerifyResponse = self.verifyGiveawayPost(text, CHAT_ID, message_id, user_id, username)

			if giveawayVerifyResponse not in giveawayIgnoreResponses:
				self.send_message(giveawayResponses[giveawayVerifyResponse], CHAT_ID, message_id)


		return JsonResponse({"ok": "POST request processed"})











	@staticmethod
	def send_message(message, chat_id, message_id):

		data = {
			"chat_id": chat_id,
			"text": message,
			"parse_mode": "HTML",
			"reply_to_message_id": message_id
		}

		


		response = requests.post(
			f"{TELEGRAM_URL}{TELEGRAM_BOT_TOKEN}/sendMessage", data=data
		)






	@staticmethod
	def verifyGiveawayPost(text, chat_id, message_id, user_id, user_username=""):


		bannedPunctuation = [".", "?", "'", '"', ",", "!", ":", ";", "(", ")", "[", "]", "{", "}", "/", "|", "^", "%", "£", "*", "&", "=", "+"]

		twitterPosts = []

		telegramUser = Telegram_User.objects.filter(telegram_id=user_id).first()

		if telegramUser:
			currentPostsToday = Post.objects.filter(user=telegramUser, telegram_message_date__year=date.today().year, telegram_message_date__month=date.today().month, telegram_message_date__day=date.today().day).all()
			currentPostsTodayCount = len(currentPostsToday)
			if currentPostsTodayCount == 5:
				return "MAX_5_POSTS_REACHED"
		else:
			telegramUser = Telegram_User(telegram_id=user_id, telegram_username=user_username)
			telegramUser.save()
			currentPostsTodayCount = 0

		for eachString in text:
			if "https://twitter.com/" in eachString:
				twitterUsername = eachString.split("https://twitter.com/")[1].split("/status")[0].lower()

				twitterLinkFormatted = eachString.split("https://twitter.com/")[1].split("/status")[1].split("/")[1].split("?")[0]
				twitterPosts.append([twitterUsername, twitterLinkFormatted])
				
		
		if len(twitterPosts) == 0:
			return "NO_POSTS"
		
		idsList = []
		for eachTweet in twitterPosts:
			if not (Post.objects.filter(tweet_id=eachTweet[1]).exists()):
				idsList.append(eachTweet[1])
		
		



		parsedIdsList = []
		if currentPostsTodayCount + len(idsList) > 5:
			max_posts_allowed_to_post = (currentPostsTodayCount + len(idsList)) - 5
			for x in range(0, max_posts_allowed_to_post):
				parsedIdsList.append(idsList[x])
		else:
			parsedIdsList = idsList


		# The purpose of this if statement is to turn parsedIdsList in to a STRING seperated by "," SO many Tweets can be retrieved in ONE REQUEST -IF THERE ARE MANY TWEETS-.
		if len(parsedIdsList) > 1:
			idsString = ",".join(parsedIdsList)
		elif len(parsedIdsList) == 1:
			idsString = parsedIdsList[0]
		else:
			return "DUPLICATE_TWEETS"
		


		

		
		



		
		params = {
			'ids': idsString,
			'tweet.fields': 'created_at'
		}


		tweet_response = requests.get(getTweetsURL, headers=auth_headers, params=params)


		

		

		try:
			responseDict = tweet_response.json()["data"]
		except KeyError:
			return "INVALID_TWEET"
		
		

		tweetsParsed = []

		for eachTweet in responseDict:
			dateCreated = parser.parse(eachTweet["created_at"])
			originalTweetText = eachTweet["text"]
			tweetID = eachTweet["id"]
			tweetText = eachTweet["text"].strip().lower().replace("\n", " ").strip()
			tweetSeperated = tweetText.split()

			tweetMentions = []
			tweetHashtags = []

			tweetCharLength = len(tweetText)

			for eachWord in tweetSeperated:
				if "@" in eachWord and len(eachWord) >= 2:
					if eachWord not in tweetMentions:
						for eachBannedPunc in bannedPunctuation:
							if eachBannedPunc in eachWord:
								eachWord = eachWord.replace(eachBannedPunc, "")

						tweetMentions.append(eachWord)

				if ("#" in eachWord or "$" in eachWord) and len(eachWord) >= 2:
					if eachWord not in tweetHashtags:
						for eachBannedPunc in bannedPunctuation:
							if eachBannedPunc in eachWord:
								eachWord = eachWord.replace(eachBannedPunc, "")
						
						tweetHashtags.append(eachWord)
			

			tweetsParsed.append([tweetID, originalTweetText, dateCreated, tweetMentions, tweetHashtags, tweetCharLength])
		

		for eachTweet in tweetsParsed:
			newPost = Post(tweet_id=eachTweet[0], tweet_text=eachTweet[1], tweet_date=eachTweet[2], telegram_message_id=message_id, user=telegramUser, tweet_mentions=",".join(eachTweet[3]), tweet_hashtags=",".join(eachTweet[4]), tweet_char_length=eachTweet[5])
			newPost.save()
		
		return "POSTS_ADDED"
		

	# 		tweet_id = models.CharField(max_length=30)
	# tweet_text = models.TextField(max_length=300)
	# twitter_username = models.CharField(max_length=40)
	# tweet_date = models.DateTimeField()

	# telegram_message_id = models.CharField(max_length=30)
	# telegram_message_date = models.DateTimeField(auto_now_add=True, blank=True)

	# is_winner = models.BooleanField(default=False)


	# user = models.ForeignKey(Telegram_User, on_delete=models.CASCADE)
		









announcementTypes = {

	"Random_Draw": """<b>Hey Community We Have Started A New Giveaway And Here Is The Winner!!</b>

	🎉 We hit ++POST_COUNT++ posts yesterday which means the prize is at ++PRIZE++ 🎉

	<b>📌 As you know we have started a daily community competition for a #giveaway</b>

	The day is officially over and the winner for ++POST_DATE++ is:
	
	<b>++USERNAME++</b> - Well Done!!
	
	<b>📍I @norbi_crypto will send you a Direct Message on Twitter to request your ERC20 wallet address to send your $XDB prize to 🤗</b>


    <b>🏆🔥🚀 CONGRATULATIONS 🚀🔥🏆</b>
	
	
	<b>📌 To the rest of community - Don’t forget to type #giveaway when posting your Tweet/Entry in this Telegram group, for your submission to be counted accurately 🙏</b>
	<b>Don’t forget to read the announcement on the competition and we would love you all to carry on with the hard work today!!</b>
	
	https://t.me/DigitalBitsPriceChat/19975
	 """




}

			


			
@method_decorator(ajax_login_required, name='dispatch')
class AjaxPostsAnnouncementView(View):

	def post(self, request):
		username = request.POST.get('username')
		prize = request.POST.get('prize')
		date = request.POST.get('date')
		postCount = request.POST.get('postCount')
		win_type = request.POST.get('win_type')

		if win_type in announcementTypes:
			announcementText = announcementTypes[win_type]
		else:
			return JsonResponse(status=404, data={'status':'false','message':'Win Type does not exist for Announcement'})
		

		announcementText = announcementText.replace("++USERNAME++", username)
		announcementText = announcementText.replace("++POST_DATE++", date)
		announcementText = announcementText.replace("++POST_COUNT++", postCount)
		announcementText = announcementText.replace("++PRIZE++", prize)

		ReceiveMessageBotView.send_message(announcementText, CHAT_ID, "")
		
		return JsonResponse({"data": {"Deleted Post": "bruh"}})

		
				
			





		
		


		

		

		
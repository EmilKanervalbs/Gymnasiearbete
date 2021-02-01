from flask import Flask, render_template, redirect, make_response, request

import json, time, datetime

from copy import deepcopy

app = Flask(__name__, static_folder="web/static", static_url_path="", template_folder="web/templates")

class Server():
	def __init__(self):
		# testUser = {
		# 	"name":"BajsMannen",
		# 	"firstName":"Bajs",
		# 	"lastName":"Mannen",
		# 	"group":["test", "test2"],
		# 	"lessons":[]
		# }
		# self.users = []
		# self.users.append(testUser)

		self.update()

		# self.content = json.loads(self.data)

		self.users = self.content["users"]

		self.userSessions = {"helo_wrold": self.users[0]}

		for user in self.users: # för varje användare
			for group in user["group"]: # för varje grupp
				if group not in self.content["groups"]: # ifall gruppen inte finns bland infromationen av grupper, skit i den
					continue
				for lesson in self.content["groups"][group]["courses"]: # för varje kurs
					user["lessons"].append(self.content["courses"][lesson]) # lägg till den i användarens kurser
	
	def update(self):
		with open("temp_resources/news.json", "r", encoding="utf-8") as zzz:
			self.data = zzz.read()
			self.content = json.loads(self.data)
	
	def getCachedUser(self, request):
		if request.cookies.get("session") in self.userSessions:
			return self.userSessions[request.cookies.get("session")]
		else:
			return None

server = Server()

@app.route("/")
def index():
    resp = make_response(redirect("/startpage"))
    resp.set_cookie("session", "helo_wrold")
    server.userSessions["helo_wrold"] = server.users[0]
    return resp # gör så att cookies skapas här

@app.route("/startpage")
def startpage():
    return render_template("startsida.html", user=server.users[0])

@app.route("/schedule")
def schedule():
    return "schema yes"

@app.route("/news")
def news():
    return "nyheter ooo"

@app.route("/assignments")
def assignments():
    return "yeah no"
    #sdsdddddddsdddsds



# content managaging saker

@app.route("/getnews/", methods=["GET"])
@app.route("/getnews/<newsID>", methods=["GET"])
def getnews(newsID=None):
	user = None

	# if request.cookies.get("session") in server.userSessions:

	if user := server.getCachedUser(request):

		# user = server.userSessions[request.cookies.get("session")]        
		group = user["group"]
		currentTime = time.time()

		if not newsID:
			newsDelivery = {"news":[]}

			for news in server.content["news"]:
				if len(newsDelivery) > 5:
					break
				elif not any(i in group for i in news["classes"]):
					continue
				elif news["startDate"] > currentTime or news["endDate"] < currentTime:
					continue
				else:
					newsDelivery["news"].append(news.copy())

			for news in newsDelivery["news"]:
				oldContent = news["content"]
				newContent = ""
				for i in range(len(oldContent)):
					newContent += oldContent[i]
					if i > 75:
						newContent += "..."
						break
				news["content"] = newContent

			return newsDelivery
		else:
			newsID = int(newsID)
			print("news requested by ID")
			for news in server.content["news"]:
				if news["newsid"] == newsID:
					print("found news ID", newsID)
					return news

	print("---------------------------------nope")
	# return '{"news":["bajs"]}'

@app.route("/getuser")
def getuser():

	if user := server.getCachedUser(request):

		userCopy = deepcopy(user)

		for result in userCopy["results"]:
			result["course"] = server.content["courses"][result["course"]]["displayName"]
			
		return userCopy

@app.route("/getassignments")
def getassignments():
	print("requested assignments")
	if user := server.getCachedUser(request):
		assignments = []

		currentTime = time.time()

		for assignment in server.content["assignments"]:
			if assignment["time"] < currentTime:
				continue
			stop = True
			for group in assignment["classes"]:
				if group in user["group"]:
					stop = False
					break
			if stop:
				continue
			assignment2 = assignment.copy()
			assignment2["course"] = server.content["courses"][assignment2["course"]]["displayName"]
			# print(assignment2)
			assignments.append(assignment2)
		
		return {"assignments" : assignments}

@app.route("/getschedule")
def getschedule():
	if request.cookies.get("session") in server.userSessions:
		user = server.userSessions[request.cookies.get("session")]
		lessons = {"normal" : [[], [], [], [], []], "exceptions" : []}
		# weekday = datetime.datetime.today().weekday()
		for group in user["group"]:
			for i in range(5):
				lessons["normal"][i] += server.content["schedule"][group]["normal"][i]

		lessonsCopy = deepcopy(lessons) # kopia för att ändra namnen på kurserna

		for day in lessonsCopy["normal"]:
			for lesson in day:
				try: # Säkerhet ifall det skulle råka vara så att den inte hittar namnet på kursen
					lesson["course"] = server.content["courses"][lesson["course"]]["displayName"]
				except KeyError:
					print("KEYERROR LESSON")
		return lessonsCopy
				
@app.route("/getresults")
def getresults():
	if user := server.getCachedUser(request):
		return user["results"]




# dev route för att slippa starta om servern när man vill läsa om "databasen" (legit en .json fil)
@app.route("/update")
def update():
	server.update()
	return redirect("/")

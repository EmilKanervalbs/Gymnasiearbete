from flask import Flask, render_template, redirect, make_response, request, send_file

import mimetypes
mimetypes.add_type("text/javascript", ".js")

import json, time, datetime

from copy import deepcopy

app = Flask(__name__, static_folder="web/static", static_url_path="", template_folder="web/templates")

class Server():
	def __init__(self):
		self.update()

		self.users = self.content["users"]

		self.userSessions = {"helo_wrold": self.users[0]}

	
	def update(self):
		with open("temp_resources/news.json", "r", encoding="utf-8") as zzz:
			data = zzz.read()
			self.content = json.loads(data)
			self.users = self.content["users"]
		
		self.initUsers()
	
	def getCachedUser(self, request):
		if request.cookies.get("session") in self.userSessions: # ifall sessioncookien kan återfinnas i sessions-saken
			return self.userSessions[request.cookies.get("session")] # skicka tillbaka användaren associerad med den
	
	def initUsers(self):
		for user in self.users: # för varje användare
			for group in user["group"]: # för varje grupp
				if group not in self.content["groups"]: # ifall gruppen inte finns bland infromationen av grupper, skit i den
					continue
				for lesson in self.content["groups"][group]["courses"]: # för varje kurs
					user["lessons"].append(self.content["courses"][lesson]) # lägg till den i användarens kurser

server = Server()

@app.route("/")
def index():
    resp = make_response(redirect("/startpage")) # skapa en redirect
    resp.set_cookie("session", "helo_wrold") # skapa en session cookie, låtsas som att man loggar in
    server.userSessions["helo_wrold"] = server.users[0]
    return resp

@app.route("/startpage/")
def startpage():
	if user := server.getCachedUser(request):

	    return render_template("startsida.html", user=user) # skicka tillbaka användaren
	
	return "", 403

@app.route("/schedule/")
def schedule():
	if user := server.getCachedUser(request):
		print(user)
		return "schema pog"

	return "", 403

@app.route("/news/")
def news():
	if user := server.getCachedUser(request):
		print(user)

		return "nyheter ooo"

	return "", 403

@app.route("/assignments/")
def assignments():
	if user := server.getCachedUser(request):
		print(user)

		return "yeah no"
    
	return "", 403



# content managaging saker

@app.route("/getnews/")
@app.route("/getnews/<newsID>")
def getnews(newsID=None):

	if user := server.getCachedUser(request):

		group = user["group"]
		currentTime = time.time()

		if not newsID:
			newsDelivery = {"news":[]}

			for news in server.content["news"]:
				if len(newsDelivery) > 5: # begränsar sig till 5 nyheter i snabbvyn
					break
				elif not any(i in group for i in news["classes"]): # om gruppen inte tillhör någon av klasserna en användare har
					continue
				elif news["startDate"] > currentTime or news["endDate"] < currentTime: # begränsar till nyheter som gäller just nu
					continue
				else:
					newsDelivery["news"].append(news.copy())

			for news in newsDelivery["news"]:
				oldContent = news["content"].replace("\n", "")
				newContent = ""
				tolerance = 0 # en variabel för att hålla koll på newline statements
				for i in range(len(oldContent)):
					newContent += oldContent[i]
					if i > 75 + tolerance:
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
	
	return "", 403

@app.route("/getuser/")
def getuser():

	if user := server.getCachedUser(request):

		userCopy = deepcopy(user)

		for result in userCopy["results"]:
			result["course"] = server.content["courses"][result["course"]]["displayName"]
		return userCopy
	
	return "", 403

@app.route("/getassignments/")
@app.route("/getassignments/<assignmentID>")
def getassignments(assignmentID=None):
	print("requested assignments")
	if user := server.getCachedUser(request):
		print(assignmentID)
		if assignmentID:
			assignmentID = int(assignmentID)
			print("assignment requiested by id")
			for assignment in server.content["assignments"]:
				if assignment["id"] == assignmentID:
					return assignment
		else:
			assignments = []

			currentTime = time.time()

			for assignment in server.content["assignments"]:
				if assignment["time"] < currentTime: # strunta i uppgifter som har förlöpt
					continue
				stop = True

				for group in assignment["classes"]:
					if group in user["group"]:
						stop = False
						break
				if stop:
					continue

				assignmentCopy = assignment.copy()
				assignmentCopy["course"] = server.content["courses"][assignmentCopy["course"]]["displayName"]

				assignments.append(assignmentCopy)
			
			return {"assignments" : assignments}
	
	return "", 403
	# ifall man inte har en valid session cookie, 403 FORBIDDEN


@app.route("/getschedule/")
def getschedule():
	if user := server.getCachedUser(request):

		lessons = {"normal" : [[], [], [], [], []], "exceptions" : []} # Mall där alla unika scheman slås ihop till

		for group in user["group"]:
			for i in range(5): # lägger ihop alla scheman dag för dag, i = dag, grupp = unikt schema
				lessons["normal"][i] += server.content["schedule"][group]["normal"][i]

		lessonsCopy = deepcopy(lessons) # kopia för att ändra namnen på kurserna

		for day in lessonsCopy["normal"]:
			for lesson in day:
				try: # Säkerhet ifall det skulle råka vara så att den inte hittar namnet på kursen
					lesson["course"] = server.content["courses"][lesson["course"]]["displayName"]
				except KeyError:
					print("KEYERROR ON LESSON")
		return lessonsCopy

	return "", 403
			
# @app.route("/getresults")
# def getresults():
# 	if user := server.getCachedUser(request):
# 		return user["results"]
	
# 	# return "", 403
	




# dev route för att slippa starta om servern när man vill läsa om "databasen" (legit en .json fil)
@app.route("/update/")
def update():
	if server.getCachedUser(request):
		server.update()
		return redirect("/")

	return "", 403

@app.errorhandler(404)
def not_found(e):
	return "idiota"
from flask import Flask, render_template, redirect

import json

app = Flask(__name__, static_folder="web/static", static_url_path="", template_folder="web/templates")

class Server():
    def __init__(self):
        testUser = {
            "name":"BajsMannen",
            "firstName":"Bajs",
            "lastName":"Mannen",
            "class":"test"
        }
        self.userSessions = []
        self.users = []
        self.users.append(testUser)

        with open("temp_resources/news.json", "r") as zzz:
            test = zzz.read()

        self.news = json.loads(test)


server = Server()

print(str(server.news)) # big problemo


@app.route("/")
def index():
    return redirect("/startpage")

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

@app.route("/getnews/")
@app.route("/getnews/<newsID>")
def getnews(newsID=None):
    return server.news
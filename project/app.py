from flask import Flask, render_template, redirect, make_response, request

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
        self.users = []
        self.users.append(testUser)
        self.userSessions = {"helo_wrold": self.users[0]}

        with open("temp_resources/news.json", "r") as zzz:
            test = zzz.read()

        self.news = json.loads(test)


server = Server()

print(str(server.news)) # big problemo


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

    print(request.cookies.get("session"))

    print(server.userSessions)

    print(request.cookies.get("session") in server.userSessions)

    user = None

    if request.cookies.get("session") in server.userSessions:
        # print("------------------------------------ok")
        user = server.userSessions[request.cookies.get("session")]
        
        group = user["class"]

        print(user["class"])

        # for news in server.news["news"]:
            
            # print("--x--",news)

        if newsID == None:
            newsDelivery = {"news":[]}

            for news in server.news["news"]:
                # print("------------------------",str(news["classes"]))
                if len(newsDelivery) > 5:
                    break
                elif group not in news["classes"]:
                    continue
                else: 
                    newsDelivery["news"].append(news)

            return newsDelivery
        else:
            newsID = int(newsID)
            print("news requested by ID")
            for news in server.news["news"]:
                if news["newsid"] == newsID:
                    print("found news ID", newsID)
                    return news

    print("---------------------------------nope")
    return '{"news":["bajs"]}'
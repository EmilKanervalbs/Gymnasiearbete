from flask import Flask, render_template, redirect

app = Flask(__name__, static_folder="web/static", static_url_path="", template_folder="web/templates")

class Server():
    def __init__(self):
        self.userSessions = []

@app.route("/")
def index():
    return redirect("/startpage")

@app.route("/startpage")
def startpage():
    return render_template("startsida.html")

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
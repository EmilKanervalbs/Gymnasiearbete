from flask import Flask, render_template

app = Flask(__name__, static_folder="web/static", static_url_path="", template_folder="web/templates")

@app.route("/")
def index():
    return render_template("index.html")

    #sdsdddddddsdddsds
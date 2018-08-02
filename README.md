# Russian Troll Tweets Exploration


## What is this?

The good people at _[FiveThirtyEight](https://github.com/fivethirtyeight/russian-troll-tweets/)_ were kind enough to release the tweets and handles of Russian Trolls in the lead-up and following the 2016 election. These data were assembled by Clemson University researchers Darren Linvill, & Patrick Warren. I'll let _FiveThirtyEight_ explain more, [here](https://fivethirtyeight.com/features/why-were-sharing-3-million-russian-troll-tweets/). I'm just exploring the data they released here.

## Installation

- Run `git clone git@github.com:fivethirtyeight/russian-troll-tweets.git` to get the Russian tweets.
- Run `python3 -m venv env` to set up your virtual environment.
- Run `source env/bin/activate` to activate your virtual environment.
- Run `pip install -r requirements.txt` to install the Python packages you'll need.
- Run `npm install -g http-server` (you might want to install NVM first).

## Running

- Run `jupyter notebook` and pull up `model-topics.ipynb`.
- Run everything in there.

## Getting visualizations working

- Run `cp intermediate-data/english-only-doc2vec-data.json doc2vec-graphics/som-account-type-viz/data/data.json`.
- Run `http-server` from within the `doc2vec-graphics/som-account-type-viz/` folder.
- Go to `http://localhost:8080`.

## When you're done

- Run `deactivate`.
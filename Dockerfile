FROM python:3.8

RUN mkdir -p /home/app
WORKDIR /home/app

COPY requirements.txt /home/app

RUN pip install -r /home/app/requirements.txt

RUN apt-get -y update

RUN apt-get install -y cron && touch /var/log/cron.log

COPY . /home/app
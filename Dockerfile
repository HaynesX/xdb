FROM python

RUN mkdir -p /home/app
WORKDIR /home/app

COPY requirements.txt /home/app

RUN pip install -r /home/app/requirements.txt

COPY . /home/app

EXPOSE 8000
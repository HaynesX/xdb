# Generated by Django 4.0.4 on 2022-05-20 23:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('xdb', '0005_alter_post_twitter_username'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='tweet_hashtags',
            field=models.TextField(blank=True, default='', max_length=300),
        ),
        migrations.AddField(
            model_name='post',
            name='tweet_mentions',
            field=models.TextField(blank=True, default='', max_length=300),
        ),
    ]

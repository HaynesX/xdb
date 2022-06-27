# Generated by Django 4.0.4 on 2022-05-20 22:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('xdb', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('tweet_id', models.CharField(max_length=30)),
                ('tweet_text', models.TextField(max_length=300)),
                ('twitter_username', models.CharField(max_length=40)),
                ('tweet_date', models.DateTimeField()),
                ('telegram_message_id', models.CharField(max_length=30)),
                ('telegram_message_date', models.DateTimeField(auto_now_add=True)),
                ('is_winner', models.BooleanField(default=False)),
                ('winning_amount', models.DecimalField(blank=True, decimal_places=2, max_digits=7)),
                ('winning_transaction', models.TextField(blank=True, default='', max_length=300)),
            ],
        ),
        migrations.CreateModel(
            name='Telegram_User',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('telegram_id', models.CharField(max_length=30)),
                ('telegram_username', models.CharField(blank=True, default='', max_length=30)),
                ('last_name', models.CharField(max_length=30)),
            ],
        ),
        migrations.DeleteModel(
            name='Person',
        ),
        migrations.AddField(
            model_name='post',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='xdb.telegram_user'),
        ),
    ]

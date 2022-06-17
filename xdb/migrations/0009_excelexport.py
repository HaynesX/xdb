# Generated by Django 4.0.5 on 2022-06-15 00:28

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('xdb', '0008_telegram_user_wallet_address'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExcelExport',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date_added', models.DateTimeField(auto_now_add=True)),
                ('task_id', models.CharField(blank=True, default='', max_length=128)),
                ('task_status', models.CharField(blank=True, default='running', max_length=128)),
            ],
        ),
    ]

# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-10 16:23
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ProxyApp', '0005_enrollmentdb_cummulativeattendance'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='enrollmentdb',
            options={'ordering': ['id']},
        ),
    ]

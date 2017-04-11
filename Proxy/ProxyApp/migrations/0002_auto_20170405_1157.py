# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-05 11:57
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ProxyApp', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='attendancedb',
            old_name='course',
            new_name='courseID',
        ),
        migrations.AlterUniqueTogether(
            name='attendancedb',
            unique_together=set([('date', 'courseID')]),
        ),
    ]
# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-11-14 05:11
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employee_management', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employeeinfo',
            name='pan_no',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='employeeinfo',
            name='provident_fund_no',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
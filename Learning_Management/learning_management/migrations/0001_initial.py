# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-10-26 04:48
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('employee_management', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('organization_management', '0001_initial'),
        ('talent_inventory', '0001_initial'),
        ('system_admin', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='HCMS_LD_Cost_Budget',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('modified_date', models.DateTimeField(auto_now=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('training_hours', models.FloatField(blank=True, null=True)),
                ('cost_per_hour', models.FloatField(blank=True, null=True)),
                ('approval_status', models.CharField(blank=True, max_length=10, null=True)),
                ('rejection_reason', models.TextField(blank=True, null=True)),
                ('rejected_on', models.DateField(blank=True, null=True)),
                ('approved_on', models.DateField(blank=True, null=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_by_learning_management_hcms_ld_cost_budget_related', to=settings.AUTH_USER_MODEL)),
                ('division', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='organization_management.TeamDetails')),
                ('modified_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='modified_by_learning_management_hcms_ld_cost_budget_related', to=settings.AUTH_USER_MODEL)),
                ('request_to_role', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='talent_inventory.HCMS_TI_Role_Details')),
            ],
            options={
                'db_table': 'hcms_ld_cost_budget',
            },
        ),
        migrations.CreateModel(
            name='HCMS_LD_Internship_Training',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('modified_date', models.DateTimeField(auto_now=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('candidate_name', models.CharField(blank=True, max_length=30, null=True)),
                ('institute_name', models.TextField(blank=True, null=True)),
                ('degree', models.CharField(blank=True, max_length=30, null=True)),
                ('passed_out_year', models.CharField(blank=True, max_length=30, null=True)),
                ('zip_code', models.CharField(blank=True, max_length=15, null=True)),
                ('address', models.TextField(blank=True, null=True)),
                ('employee_status', models.BooleanField()),
                ('country', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='system_admin.CountryInfo')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_by_learning_management_hcms_ld_internship_training_related', to=settings.AUTH_USER_MODEL)),
                ('division', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='organization_management.TeamDetails')),
                ('modified_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='modified_by_learning_management_hcms_ld_internship_training_related', to=settings.AUTH_USER_MODEL)),
                ('reporting_authority', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='employee_management.EmployeeInfo')),
                ('state', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='system_admin.StateInfo')),
            ],
            options={
                'db_table': 'hcms_ld_internship_training',
            },
        ),
        migrations.CreateModel(
            name='HCMS_LD_Self_Request',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('modified_date', models.DateTimeField(auto_now=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('request_type', models.CharField(blank=True, max_length=10, null=True)),
                ('training_name', models.TextField(blank=True, null=True)),
                ('request_reason', models.TextField(blank=True, null=True)),
                ('remarks', models.TextField(blank=True, null=True)),
                ('approval_status', models.CharField(blank=True, max_length=10, null=True)),
                ('rejection_reason', models.TextField(blank=True, null=True)),
                ('rejected_on', models.DateField(blank=True, null=True)),
                ('approved_on', models.DateField(blank=True, null=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_by_learning_management_hcms_ld_self_request_related', to=settings.AUTH_USER_MODEL)),
                ('division', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='organization_management.TeamDetails')),
                ('manager', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='self_request_manager_id', to='employee_management.EmployeeInfo')),
                ('modified_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='modified_by_learning_management_hcms_ld_self_request_related', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'hcms_ld_self_request',
            },
        ),
        migrations.CreateModel(
            name='HCMS_LD_Training_Detail',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('modified_date', models.DateTimeField(auto_now=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('training_name', models.TextField(blank=True, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('start_date', models.DateField(blank=True, null=True)),
                ('end_date', models.DateField(blank=True, null=True)),
                ('attachment', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='organization_management.OrganizationAttachment')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_by_learning_management_hcms_ld_training_detail_related', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='modified_by_learning_management_hcms_ld_training_detail_related', to=settings.AUTH_USER_MODEL)),
                ('training_category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='training_category_refitem', to='system_admin.Reference_Items')),
                ('training_methodology', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='training_methodology_refitem', to='system_admin.Reference_Items')),
                ('training_type', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='training_type_refitem', to='system_admin.Reference_Items')),
            ],
            options={
                'db_table': 'hcms_ld_training_detail',
            },
        ),
        migrations.CreateModel(
            name='HCMS_LD_Training_Division_Rel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('modified_date', models.DateTimeField(auto_now=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_by_learning_management_hcms_ld_training_division_rel_related', to=settings.AUTH_USER_MODEL)),
                ('division', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='organization_management.TeamDetails')),
                ('modified_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='modified_by_learning_management_hcms_ld_training_division_rel_related', to=settings.AUTH_USER_MODEL)),
                ('training', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='learning_management.HCMS_LD_Training_Detail')),
            ],
            options={
                'db_table': 'hcms_ld_training_division_rel',
            },
        ),
        migrations.CreateModel(
            name='HCMS_LD_Training_Recommendation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('modified_date', models.DateTimeField(auto_now=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('recommendation_type', models.CharField(blank=True, max_length=15, null=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_by_learning_management_hcms_ld_training_recommendation_related', to=settings.AUTH_USER_MODEL)),
                ('division', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='organization_management.TeamDetails')),
                ('modified_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='modified_by_learning_management_hcms_ld_training_recommendation_related', to=settings.AUTH_USER_MODEL)),
                ('recommended_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='recommended_by_id', to='employee_management.EmployeeInfo')),
                ('training', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='learning_management.HCMS_LD_Training_Detail')),
            ],
            options={
                'db_table': 'hcms_ld_training_recommendation',
            },
        ),
        migrations.CreateModel(
            name='HCMS_LD_Training_Recommendation_Rel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('modified_date', models.DateTimeField(auto_now=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_by_learning_management_hcms_ld_training_recommendation_rel_related', to=settings.AUTH_USER_MODEL)),
                ('employee', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='recommendation_employee_id', to='employee_management.EmployeeInfo')),
                ('modified_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='modified_by_learning_management_hcms_ld_training_recommendation_rel_related', to=settings.AUTH_USER_MODEL)),
                ('training_recommendation', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='learning_management.HCMS_LD_Training_Recommendation')),
            ],
            options={
                'db_table': 'hcms_ld_training_recommendation_rel',
            },
        ),
        migrations.AddField(
            model_name='hcms_ld_self_request',
            name='training',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='learning_management.HCMS_LD_Training_Detail'),
        ),
        migrations.AddField(
            model_name='hcms_ld_internship_training',
            name='training',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='learning_management.HCMS_LD_Training_Detail'),
        ),
        migrations.AddField(
            model_name='hcms_ld_cost_budget',
            name='training',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='learning_management.HCMS_LD_Training_Detail'),
        ),
    ]
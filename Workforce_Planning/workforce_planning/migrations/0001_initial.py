# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-10-26 04:48
from __future__ import unicode_literals

from django.conf import settings
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('organization_management', '0001_initial'),
        ('system_admin', '0001_initial'),
        ('talent_inventory', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='HCMS_WP_Strategy_Analysis',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('modified_date', models.DateTimeField(auto_now=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('strategy_analysis_summary', models.CharField(blank=True, max_length=250, null=True)),
                ('strategy_analysis_details', models.TextField(blank=True, null=True)),
                ('strategy_analysis_period_from', models.DateField(blank=True, null=True)),
                ('strategy_analysis_period_to', models.DateField(blank=True, null=True)),
                ('strategy_analysis_defined_on', models.DateField(blank=True, null=True)),
                ('strategy_analysis_approval_board_ids', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(blank=True, null=True), size=None)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_by_workforce_planning_hcms_wp_strategy_analysis_related', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='modified_by_workforce_planning_hcms_wp_strategy_analysis_related', to=settings.AUTH_USER_MODEL)),
                ('strategy_analysis_org', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='strategy_org', to='organization_management.OrganizationInfo')),
                ('strategy_analysis_org_unit', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='strategy_org_unit', to='organization_management.OrganizationUnit')),
            ],
            options={
                'db_table': 'hcms_wp_strategy_analysis',
            },
        ),
        migrations.CreateModel(
            name='HCMS_WP_Strategy_Steeple',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('modified_date', models.DateTimeField(auto_now=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('steeple_execution_details', models.CharField(blank=True, max_length=250, null=True)),
                ('steeple_workforce_details', models.CharField(blank=True, max_length=250, null=True)),
                ('steeple_social_desc', models.CharField(blank=True, max_length=250, null=True)),
                ('steeple_technological_desc', models.CharField(blank=True, max_length=250, null=True)),
                ('steeple_economical_desc', models.CharField(blank=True, max_length=250, null=True)),
                ('steeple_environmental_desc', models.CharField(blank=True, max_length=250, null=True)),
                ('steeple_political_desc', models.CharField(blank=True, max_length=250, null=True)),
                ('steeple_legal_desc', models.CharField(blank=True, max_length=250, null=True)),
                ('steeple_ethical_desc', models.CharField(blank=True, max_length=250, null=True)),
                ('steeple_social_neg_impact', models.IntegerField(blank=True, null=True)),
                ('steeple_social_pos_impact', models.IntegerField(blank=True, null=True)),
                ('steeple_technological_neg_impact', models.IntegerField(blank=True, null=True)),
                ('steeple_technological_pos_impact', models.IntegerField(blank=True, null=True)),
                ('steeple_economical_neg_impact', models.IntegerField(blank=True, null=True)),
                ('steeple_economical_pos_impact', models.IntegerField(blank=True, null=True)),
                ('steeple_environmental_neg_impact', models.IntegerField(blank=True, null=True)),
                ('steeple_environmental_pos_impact', models.IntegerField(blank=True, null=True)),
                ('steeple_political_neg_impact', models.IntegerField(blank=True, null=True)),
                ('steeple_political_pos_impact', models.IntegerField(blank=True, null=True)),
                ('steeple_legal_neg_impact', models.IntegerField(blank=True, null=True)),
                ('steeple_legal_pos_impact', models.IntegerField(blank=True, null=True)),
                ('steeple_ethical_neg_impact', models.IntegerField(blank=True, null=True)),
                ('steeple_ethical_pos_impact', models.IntegerField(blank=True, null=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_by_workforce_planning_hcms_wp_strategy_steeple_related', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='modified_by_workforce_planning_hcms_wp_strategy_steeple_related', to=settings.AUTH_USER_MODEL)),
                ('steeple_strategy', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='workforce_planning.HCMS_WP_Strategy_Analysis')),
            ],
            options={
                'db_table': 'hcms_wp_strategy_steeple',
            },
        ),
        migrations.CreateModel(
            name='HCMS_WP_Strategy_Workforce_Profile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('modified_date', models.DateTimeField(auto_now=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('wf_profile_task_summary', models.CharField(blank=True, max_length=250, null=True)),
                ('wf_profile_required', models.IntegerField(blank=True, null=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_by_workforce_planning_hcms_wp_strategy_workforce_profile_related', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='modified_by_workforce_planning_hcms_wp_strategy_workforce_profile_related', to=settings.AUTH_USER_MODEL)),
                ('wf_profile_grade', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='wf_profile_grade', to='system_admin.Reference_Items')),
                ('wf_profile_role', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='talent_inventory.HCMS_TI_Role_Details')),
                ('wf_profile_strategy', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='workforce_planning.HCMS_WP_Strategy_Analysis')),
            ],
            options={
                'db_table': 'hcms_wp_strategy_workforce_profile',
            },
        ),
    ]
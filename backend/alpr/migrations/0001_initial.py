from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('camera', '0003_camera_status_alter_camera_zone'),
    ]

    operations = [
        migrations.CreateModel(
            name='Plaque',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('numero', models.CharField(db_index=True, max_length=20)),
                ('date_detection', models.DateTimeField(auto_now_add=True)),
                ('reconnue', models.BooleanField(default=False)),
                ('alerte', models.BooleanField(default=False)),
                ('camera', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='camera.camera')),
            ],
        ),
    ]

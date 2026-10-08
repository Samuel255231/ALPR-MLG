#\alpr\urls.py
from django.urls import path
from .views import home, get_totals, detect_and_save, get_chart_data, auth_test
from django.conf import settings
from django.conf.urls.static import static
from .views import add_proprietaire, get_proprietaire_by_plaque, get_top_plates, get_camera_stats
from .views import list_proprietaires, delete_proprietaire, update_proprietaire, get_recognition_stats
urlpatterns = [
     path('', home),
    path('totals/', get_totals, name='alpr_totals'),
    path('detect/', detect_and_save, name='alpr_detect'),
    path('chart_data/', get_chart_data, name='alpr_chart_data'),
    path('auth_test/', auth_test),
    path("proprietaire/", get_proprietaire_by_plaque),
    path("proprietaire/add/", add_proprietaire),
    path("proprietaires/", list_proprietaires),
    path("proprietaire/<int:id>/delete/", delete_proprietaire),
    path("proprietaire/<int:id>/update/", update_proprietaire),

    path('dashboard/top-plates/', get_top_plates, name='alpr_top_plates'),
    path('dashboard/camera-stats/', get_camera_stats, name='alpr_camera_stats'),
    path('dashboard/recognition-stats/', get_recognition_stats, name='alpr_recognition_stats'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

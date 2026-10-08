from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import (
    home,
    auth_test,
    get_totals,
    detect_and_save,
    list_detections,
    get_chart_data,
    get_top_plates,
    get_camera_stats,
    get_recognition_stats,
)

urlpatterns = [
    path('', home),
    path('auth_test/', auth_test),
    path('totals/', get_totals, name='alpr_totals'),
    path('detect/', detect_and_save, name='alpr_detect'),
    path('detections/', list_detections, name='alpr_detections'),
    path('chart_data/', get_chart_data, name='alpr_chart_data'),
    path('dashboard/top-plates/', get_top_plates, name='alpr_top_plates'),
    path('dashboard/camera-stats/', get_camera_stats, name='alpr_camera_stats'),
    path('dashboard/recognition-stats/', get_recognition_stats, name='alpr_recognition_stats'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

"""
URL configuration for gestion_stock project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('mouvements/', include('mouvement.urls')), 
    path('stocks/', include('stock.urls')),
    path('cameras/', include('camera.urls')),
    path('zones/', include('zone.urls')),
    path('camions/', include('camion.urls')),
    path('evenements/', include('mouvement_camion.urls')),
    path('users/', include('users.urls')),
    path('alpr/', include('alpr.urls')),   # ✅ ajout ALPR
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


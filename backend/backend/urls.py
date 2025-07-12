"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
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
from django.urls import path
from signup.views import RegisterView, CustomTokenObtainPairView, user_detail
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
from items.views import ItemListCreateView, my_items, MyItemDetailView, PublicItemDetailView, SwapListCreateView, SwapUpdateView, AvailableItemsView, SwapMessageListCreateView, SwapDeleteView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('api/user/', user_detail, name='user-detail'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/items/', ItemListCreateView.as_view(), name='item-list-create'),
    path('api/my-items/', my_items, name='my-items'),
    path('api/my-items/<int:pk>/', MyItemDetailView.as_view(), name='my-item-detail'),
    path('api/items/<int:pk>/', PublicItemDetailView.as_view(), name='public-item-detail'),
    path('api/swaps/', SwapListCreateView.as_view(), name='swap-list-create'),
    path('api/swaps/<int:pk>/', SwapUpdateView.as_view(), name='swap-update'),
    path('api/swaps/<int:pk>/delete/', SwapDeleteView.as_view(), name='swap-delete'),
    path('api/available-items/', AvailableItemsView.as_view(), name='available-items'),
    path('api/swaps/<int:swap_id>/messages/', SwapMessageListCreateView.as_view(), name='swap-messages'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

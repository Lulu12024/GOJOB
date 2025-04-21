from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'jobs', views.JobViewSet)
router.register(r'applications', views.ApplicationViewSet)
router.register(r'messages/', views.MessageViewSet)
router.register(r'flash-jobs', views.FlashJobViewSet)
router.register(r'favorites/', views.FavoriteViewSet, basename='favorite')
router.register(r'notifications', views.NotificationViewSet, basename='notification')
router.register(r'statistics', views.StatisticsViewSet, basename='statistics')
router.register(r'contracts', views.ContractViewSet)
router.register(r'apply-ai', views.ApplyAIViewSet, basename='apply_ai')
router.register(r'subscription-plans', views.SubscriptionPlanViewSet)
router.register(r'subscriptions', views.SubscriptionViewSet, basename='subscription')
router.register(r'payments', views.PaymentViewSet, basename='payment')
router.register(r'job-boosts', views.JobBoostViewSet, basename='job_boost')
router.register(r'job-shares', views.JobShareViewSet, basename='job_share')
router.register(r'connections', views.UserConnectionViewSet, basename='connection')

urlpatterns = [
    # Auth routes
    path('auth/register', views.register_user, name='register'),
    path('auth/login', views.login_view, name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', views.logout_user, name='logout'),
    
    # API routes
    path('', include(router.urls)),
    
    # User profile routes
    path('users/profile/', views.UserViewSet.as_view({'get': 'profile', 'put': 'profile'}), name='user-profile'),
    path('users/profile/details/', views.UserViewSet.as_view({'put': 'update_profile'}), name='user-profile-details'),
]
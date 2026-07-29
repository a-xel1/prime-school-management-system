from django.urls import path

from .views import (
    TeacherDetailView,
    TeacherListCreateView,
    TeacherStatsView,
)


urlpatterns = [
    path(
        "",
        TeacherListCreateView.as_view(),
        name="teacher-list-create",
    ),
    path(
        "stats/",
        TeacherStatsView.as_view(),
        name="teacher-stats",
    ),
    path(
        "<int:pk>/",
        TeacherDetailView.as_view(),
        name="teacher-detail",
    ),
]
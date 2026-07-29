from django.urls import path

from .views import (
    StudentDetailView,
    StudentListCreateView,
    StudentStatsView,
)


urlpatterns = [
    path(
        "",
        StudentListCreateView.as_view(),
        name="student-list-create",
    ),
    path(
        "stats/",
        StudentStatsView.as_view(),
        name="student-stats",
    ),
    path(
        "<int:pk>/",
        StudentDetailView.as_view(),
        name="student-detail",
    ),
]
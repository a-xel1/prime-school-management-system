from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsAdmin

from .models import Teacher
from .pagination import TeacherPagination
from .serializers import TeacherSerializer


class TeacherListCreateView(generics.ListCreateAPIView):
    serializer_class = TeacherSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    pagination_class = TeacherPagination

    def get_queryset(self):
        queryset = Teacher.objects.all()

        search_term = self.request.query_params.get(
            "search",
            "",
        ).strip()

        status_filter = self.request.query_params.get(
            "status",
            "",
        ).strip()

        employment_type_filter = (
            self.request.query_params.get(
                "employment_type",
                "",
            ).strip()
        )

        if search_term:
            queryset = queryset.filter(
                Q(first_name__icontains=search_term)
                | Q(last_name__icontains=search_term)
                | Q(other_names__icontains=search_term)
                | Q(staff_number__icontains=search_term)
                | Q(email__icontains=search_term)
                | Q(phone_number__icontains=search_term)
                | Q(
                    specialization__icontains=
                    search_term
                )
                | Q(
                    qualification__icontains=
                    search_term
                )
            )

        if status_filter in Teacher.Status.values:
            queryset = queryset.filter(
                status=status_filter,
            )

        if (
            employment_type_filter
            in Teacher.EmploymentType.values
        ):
            queryset = queryset.filter(
                employment_type=
                employment_type_filter,
            )

        return queryset


class TeacherDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class TeacherStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        teachers = Teacher.objects.all()

        return Response(
            {
                "total": teachers.count(),
                "active": teachers.filter(
                    status=Teacher.Status.ACTIVE,
                ).count(),
                "inactive": teachers.filter(
                    status=Teacher.Status.INACTIVE,
                ).count(),
                "on_leave": teachers.filter(
                    status=Teacher.Status.ON_LEAVE,
                ).count(),
                "terminated": teachers.filter(
                    status=Teacher.Status.TERMINATED,
                ).count(),
                "full_time": teachers.filter(
                    employment_type=(
                        Teacher.EmploymentType.FULL_TIME
                    ),
                ).count(),
                "part_time": teachers.filter(
                    employment_type=(
                        Teacher.EmploymentType.PART_TIME
                    ),
                ).count(),
                "contract": teachers.filter(
                    employment_type=(
                        Teacher.EmploymentType.CONTRACT
                    ),
                ).count(),
            }
        )
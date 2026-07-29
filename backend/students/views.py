from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsAdmin

from .models import Student
from .pagination import StudentPagination
from .serializers import StudentSerializer


class StudentListCreateView(generics.ListCreateAPIView):
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    pagination_class = StudentPagination

    def get_queryset(self):
        queryset = Student.objects.all()

        search_term = self.request.query_params.get(
            "search",
            "",
        ).strip()

        status_filter = self.request.query_params.get(
            "status",
            "",
        ).strip()

        if search_term:
            queryset = queryset.filter(
                Q(first_name__icontains=search_term)
                | Q(last_name__icontains=search_term)
                | Q(other_names__icontains=search_term)
                | Q(admission_number__icontains=search_term)
                | Q(email__icontains=search_term)
                | Q(guardian_name__icontains=search_term)
            )

        if status_filter in Student.Status.values:
            queryset = queryset.filter(
                status=status_filter,
            )

        return queryset


class StudentDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class StudentStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        students = Student.objects.all()

        return Response(
            {
                "total": students.count(),
                "active": students.filter(
                    status=Student.Status.ACTIVE,
                ).count(),
                "inactive": students.filter(
                    status=Student.Status.INACTIVE,
                ).count(),
                "graduated": students.filter(
                    status=Student.Status.GRADUATED,
                ).count(),
                "suspended": students.filter(
                    status=Student.Status.SUSPENDED,
                ).count(),
            }
        )
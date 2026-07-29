from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    message = "Only administrators can access this resource."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "admin"
        )


class IsTeacher(BasePermission):
    message = "Only teachers can access this resource."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "teacher"
        )


class IsStudent(BasePermission):
    message = "Only students can access this resource."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "student"
        )


class IsParent(BasePermission):
    message = "Only parents can access this resource."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "parent"
        )


class IsAdminOrTeacher(BasePermission):
    message = "Only administrators or teachers can access this resource."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ["admin", "teacher"]
        )
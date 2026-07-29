from django.contrib import admin

from .models import Teacher


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = [
        "staff_number",
        "full_name",
        "specialization",
        "employment_type",
        "status",
        "employment_date",
    ]

    list_filter = [
        "status",
        "employment_type",
        "gender",
        "employment_date",
    ]

    search_fields = [
        "staff_number",
        "first_name",
        "last_name",
        "other_names",
        "email",
        "phone_number",
        "specialization",
        "qualification",
    ]

    readonly_fields = [
        "staff_number",
        "created_at",
        "updated_at",
    ]

    ordering = [
        "first_name",
        "last_name",
    ]

    fieldsets = [
        (
            "Account",
            {
                "fields": [
                    "user",
                    "staff_number",
                ]
            },
        ),
        (
            "Personal Information",
            {
                "fields": [
                    "first_name",
                    "last_name",
                    "other_names",
                    "date_of_birth",
                    "gender",
                    "email",
                    "phone_number",
                    "address",
                ]
            },
        ),
        (
            "Professional Information",
            {
                "fields": [
                    "qualification",
                    "specialization",
                ]
            },
        ),
        (
            "Employment Information",
            {
                "fields": [
                    "employment_date",
                    "employment_type",
                    "status",
                ]
            },
        ),
        (
            "Emergency Contact",
            {
                "fields": [
                    "emergency_contact_name",
                    "emergency_contact_phone",
                ]
            },
        ),
        (
            "System Information",
            {
                "fields": [
                    "created_at",
                    "updated_at",
                ]
            },
        ),
    ]